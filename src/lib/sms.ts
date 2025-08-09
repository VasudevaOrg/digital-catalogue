// src/lib/sms.ts
import { Customer, Order, SMSMessage } from "@/types";
import { api } from "./api";

export interface SMSTemplates {
  otp: (otp: string) => string;
  orderUpdate: (customer: Customer, order: Order) => string;
  promotional: (customer: Customer, message: string) => string;
}

export const smsTemplates: SMSTemplates = {
  otp: (otp: string) => {
    return `Your OTP for Digital Catalogue login is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
  },

  orderUpdate: (customer: Customer, order: Order) => {
    const statusMessages = {
      pending: "Order received and pending confirmation",
      confirmed: "Order confirmed and being processed",
      preparing: "Order is being prepared",
      ready:
        order.deliveryType === "pickup"
          ? "Order ready for pickup"
          : "Order ready for delivery",
      delivered: "Order delivered successfully",
      cancelled: "Order cancelled",
    };

    return `Order #${order.invoiceNumber}: ${
      statusMessages[order.orderStatus]
    }. Amount: ₹${order.totalAmount}. Thank you!`;
  },

  promotional: (customer: Customer, message: string) => {
    return `Hi ${customer.name || "Customer"}, ${message} - Digital Catalogue`;
  },
};

export class SMSService {
  private apiKey: string;
  private senderId: string;

  constructor() {
    this.apiKey = process.env.SMS_API_KEY || "";
    this.senderId = process.env.SMS_SENDER_ID || "DIGCAT";
  }

  async sendSMS(
    phoneNumber: string,
    message: string,
    messageType: SMSMessage["messageType"] = "promotional"
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await api.post("/api/sms/send", {
        phoneNumber,
        message,
        messageType,
        senderId: this.senderId,
      });

      return {
        success: true,
        messageId: response.data.messageId,
      };
    } catch (error: any) {
      console.error("SMS send error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to send SMS",
      };
    }
  }

  async sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const message = smsTemplates.otp(otp);
    const result = await this.sendSMS(phoneNumber, message, "otp");
    return result.success;
  }

  async sendOrderUpdate(customer: Customer, order: Order): Promise<boolean> {
    const message = smsTemplates.orderUpdate(customer, order);
    const result = await this.sendSMS(
      customer.phoneNumber,
      message,
      "order_update"
    );
    return result.success;
  }

  async sendPromotionalMessage(
    customers: Customer[],
    message: string
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const customer of customers) {
      const fullMessage = smsTemplates.promotional(customer, message);
      const result = await this.sendSMS(
        customer.phoneNumber,
        fullMessage,
        "promotional"
      );

      if (result.success) {
        success++;
      } else {
        failed++;
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return { success, failed };
  }

  async getMessageStatus(messageId: string): Promise<SMSMessage["status"]> {
    try {
      const response = await api.get(`/api/sms/status/${messageId}`);
      return response.data.status;
    } catch (error) {
      console.error("SMS status check error:", error);
      return "failed";
    }
  }

  async getMessageHistory(
    customerId: string,
    limit: number = 50
  ): Promise<SMSMessage[]> {
    try {
      const response = await api.get(
        `/api/sms/history/${customerId}?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("SMS history error:", error);
      return [];
    }
  }
}

export const smsService = new SMSService();
