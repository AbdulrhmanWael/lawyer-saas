"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import PhoneInput from "react-phone-number-input/input";
import { contactClient, ContactPayload } from "@/services/contactService";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useSiteData } from "../../context/SiteContext";

const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.email("Invalid email format."),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+\d{7,15}$/.test(val),
      "Invalid phone number format."
    ),
  title: z.string().min(5, "Title must be at least 5 characters."),
  details: z.string().min(20, "Message must be at least 20 characters."),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations("Main.Contact");
  const { siteSettings } = useSiteData();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setLoading(true);
      await contactClient.create(data as ContactPayload);
      toast.success(t("success"));
      reset();
    } catch (err) {
      console.error(err);
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-10">
      {/* Left side contact info */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center space-y-6"
      >
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
          {t("title")}
        </h2>
        <p className="text-[var(--color-text)]">{t("intro")}</p>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="text-[var(--color-primary)]" />
            <span>{siteSettings?.footer.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="text-[var(--color-primary)]" />
            <span>{siteSettings?.footer.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="text-[var(--color-primary)]" />
            <span>{siteSettings?.footer.address}</span>
          </div>
        </div>
      </motion.div>

      {/* Right side form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[var(--color-bg)] rounded-2xl shadow-lg p-6 space-y-4"
      >
        {/* Name */}
        <div>
          <label className="flex items-center space-x-2 font-medium">
            <User size={18} />
            <span>{t("name")}</span>
          </label>
          <input
            {...register("name")}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center space-x-2 font-medium">
            <Mail size={18} />
            <span>{t("email")}</span>
          </label>
          <input
            {...register("email")}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="flex items-center space-x-2 font-medium">
            <Phone size={18} />
            <span>{t("phone")}</span>
          </label>
          <PhoneInput
            country="EG"
            placeholder="+20 101 123 4567"
            className="w-full mt-1 px-3 py-2 border rounded-lg"
            onChange={(val) => setValue("phone", val || "")}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="flex items-center space-x-2 font-medium">
            <MessageSquare size={18} />
            <span>{t("titleField")}</span>
          </label>
          <input
            {...register("title")}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Details */}
        <div>
          <label className="flex items-center space-x-2 font-medium">
            <MessageSquare size={18} />
            <span>{t("details")}</span>
          </label>
          <textarea
            {...register("details")}
            rows={5}
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          />
          {errors.details && (
            <p className="text-red-500 text-sm mt-1">
              {errors.details.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-primary)] text-white py-2 px-4 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? t("loading") : t("submit")}
        </button>
      </motion.form>
    </section>
  );
}
