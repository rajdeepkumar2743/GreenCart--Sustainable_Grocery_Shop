import { assets, footerLinks } from "../assets/assets";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.div
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-gradient-to-tr from-primary/10 via-white to-primary/10 rounded-t-3xl shadow-inner border-t border-primary/20 text-gray-600"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-12 border-b border-gray-400/20">
        {/* Logo and About */}
        <div className="max-w-md">
          <motion.img
            className="w-28 md:w-32 hover:scale-105 transition-transform duration-300"
            src={assets.logo}
            alt="logo"
            whileHover={{ scale: 1.07 }}
          />
          <p className="mt-6 leading-relaxed text-sm md:text-base text-gray-700">
            We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-between w-full md:w-[55%] gap-6">
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              className="min-w-[120px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="font-semibold text-base text-gray-800 mb-2 md:mb-4">
                {section.title}
              </h3>
              <ul className="text-sm space-y-2">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      className="hover:text-primary hover:underline transition-all duration-200 ease-in-out"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <motion.p
        className="py-6 text-center text-sm md:text-base text-gray-500/80 tracking-wide"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-primary">GreenCart</span>. All Rights Reserved.
      </motion.p>
    </motion.div>
  );
};

export default Footer;
