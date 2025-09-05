"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SidebarContactForm({ service }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    pageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormData((prev) => ({ ...prev, pageUrl: window.location.href }));
    }
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.contact.trim()) {
      newErrors.contact = "Contact number is required.";
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.contact)) {
      newErrors.contact = "Please enter a valid contact number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    const data = new URLSearchParams();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("contact", formData.contact);
    data.append("service", service || "");
    data.append("pageUrl", formData.pageUrl);

    try {
      const res = await fetch("/api/submit-contact", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setFormData({ name: "", email: "", contact: "", pageUrl: formData.pageUrl });
        router.push("/thankyou");
      } else {
        alert("❌ Failed: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <aside className="w-full   sticky top-32">
      <div className="bg-white shadow border rounded-lg p-5">
        <h4 className="text-lg font-medium mb-4">Need Help?</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name*"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.name ? "border-[#833DFA]" : ""
              }`}
            />
            {errors.name && (
              <p className="text-[#833DFA] text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email*"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.email ? "border-[#833DFA]" : ""
              }`}
            />
            {errors.email && (
              <p className="text-[#833DFA] text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="contact*"
              placeholder="Phone*"
              value={formData.contact}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md text-sm ${
                errors.contact ? "border-[#833DFA]" : ""
              }`}
            />
            {errors.contact && (
              <p className="text-[#833DFA] text-xs mt-1">{errors.contact}</p>
            )}
          </div>

          <input type="hidden" name="service" value={service || ""} />
          <input type="hidden" name="pageUrl" value={formData.pageUrl} />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-2 rounded-md text-sm font-medium ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#833DFA] hover:bg-purple-600 transition-colors duration-200"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </button>
        </form>
      </div>
    </aside>
  );
}
