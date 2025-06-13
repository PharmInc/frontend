import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const cardVariants = {
  initial: { opacity: 0, y: 40, rotateY: 0 },
  animate: { opacity: 1, y: 0, rotateY: 0, transition: { duration: 0.8 } },
  hover: { scale: 1.03, rotateY: 10, boxShadow: "0 8px 32px 0 rgba(59,130,246,0.25)" },
};

const Hero = () => {
  return (
    <section className="relative pt-24 pb-16 hero-gradient overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-3xl"
          style={{ top: '-6rem', left: '-8rem' }}
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-[#2563EB]/20 rounded-full blur-2xl"
          style={{ bottom: '-4rem', right: '-6rem' }}
          animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 drop-shadow-lg"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Where Medical Minds Connect
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Join a trusted network of healthcare professionals advancing care through collaboration.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div
  whileHover={{ scale: 1.05, boxShadow: "0 0 16px #3B82F6" }}
  onClick={() =>
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSdXDIwqebo7ClSm04_1UWdJhAfLxI_PO7XtGxrf2HhmhgU-Nw/viewform?usp=dialog",
      "_blank"
    )
  }
  className="cursor-pointer"
>
  <Button size="lg" className="bg-[#3B82F6] hover:bg-[#3B82F6]/90 shadow-lg">
    Join The Waitlist
  </Button>
</motion.div>

              <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 16px #3B82F6" }}>
                <Button size="lg" variant="outline" className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/5 shadow">
                  See How It Works
                </Button>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            className="lg:w-1/2 flex justify-center items-center"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-0"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-6 py-3 text-white flex items-center rounded-t-2xl shadow-lg border-b border-blue-100">
                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-400 mr-auto"></div>
                <span className="text-sm font-medium">Dr. Priya Sharma - Oncology Profile</span>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 border-4 border-[#3B82F6]/20 shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 6 }}
                  >
                    <span className="text-[#3B82F6] font-bold text-xl">SC</span>
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-xl">Dr. Priya Sharma</h3>
                    <p className="text-gray-600">Oncologist</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="px-2 py-0.5 text-xs bg-[#EFF6FF] text-[#1D4ED8] rounded-full">AIIMS Delhi</div>
                      <div className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">412 connections</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <motion.div
                    className="p-3 rounded-lg bg-gray-50 border border-gray-100 shadow"
                    whileHover={{ scale: 1.02, backgroundColor: "#EFF6FF" }}
                  >
                    <h4 className="font-medium text-sm text-gray-600">Recent Activity</h4>
                    <p className="text-gray-800 mt-1">Co-led cancer awareness drive in Lucknow's govt hospital</p>
                  </motion.div>
                  <motion.div
                    className="p-3 rounded-lg bg-[#EFF6FF] border border-[#3B82F6]/20 shadow"
                    whileHover={{ scale: 1.02, backgroundColor: "#DBEAFE" }}
                  >
                    <h4 className="font-medium text-sm text-[#1D4ED8]">Upcoming Conference</h4>
                    <p className="text-gray-800 mt-1">Panel speaker at Indian Public Health Conference 2025</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <motion.div
        className="container mx-auto px-4 mt-16 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center text-gray-400 text-sm">
          <span>Trusted by medical professionals from:</span>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="font-medium text-gray-600">AIIMS Delhi</div>
            <div className="font-medium text-gray-600">Apollo Hospitals</div>
            <div className="font-medium text-gray-600">Fortis Healthcare</div>
            <div className="font-medium text-gray-600">Christian Medical College (CMC)</div>
            <div className="font-medium text-gray-600">PGIMER</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
