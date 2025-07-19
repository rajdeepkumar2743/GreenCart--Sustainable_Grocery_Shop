import React, { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xnnjgbel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong. Try again later.");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f4fcf9] via-white to-[#f0f4ff] py-16 px-4 max-h-screen flex items-center justify-center">
      <motion.div
        className="max-w-lg w-full mx-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-4xl font-bold text-center text-primary mb-1 tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Contact Us
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 mb-4 text-[14px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          We'd love to hear from you! Fill out the form below.
        </motion.p>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-xl border border-gray-200"
        >
          <div className="relative">
            <label className="block mb-1 text-gray-700 font-semibold text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="peer w-full border border-gray-300 px-3 py-2.5 rounded-md base focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 shadow-sm hover:shadow-md bg-white"
              required
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-gray-700 font-semibold text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="peer w-full border border-gray-300 px-3 py-2.5 rounded-md base focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 shadow-sm hover:shadow-md bg-white"
              required
            />
          </div>

          <div className="relative">
            <label className="block mb-1 text-gray-700 font-semibold base">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              placeholder="Type your message here..."
              className="peer w-full border border-gray-300 px-3 py-2.5 rounded-md base focus:outline-none focus:ring-2 focus:ring-primary transition duration-200 shadow-sm hover:shadow-md resize-none bg-white"
              required
            ></textarea>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            className="w-full bg-primary text-white px-4 py-2.5 rounded-md base font-semibold hover:bg-primary/90 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
