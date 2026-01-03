import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  BarChart3, 
  Smartphone, 
  Lock, 
  MessageCircle 
} from 'lucide-react';

const benefits = [
  { icon: Zap, label: 'Instant Payroll' },
  { icon: Clock, label: 'Smart Attendance' },
  { icon: BarChart3, label: 'Tax Compliance' },
  { icon: Smartphone, label: 'Mobile App' },
  { icon: Lock, label: 'Data Security' },
  { icon: MessageCircle, label: '24/7 Support' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const BenefitsSection: React.FC = () => {
  return (
    <section id="benefits" className="py-20 md:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Dayflow?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage your workforce efficiently
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group flex items-center gap-4 bg-card py-4 px-6 rounded-full shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-3 bg-lavender rounded-full group-hover:bg-primary/20 transition-colors">
                <benefit.icon size={24} className="text-primary" />
              </div>
              <span className="font-semibold text-foreground">{benefit.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
