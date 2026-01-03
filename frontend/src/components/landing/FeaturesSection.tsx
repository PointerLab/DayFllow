import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'Time Tracking Module',
    description: 'Monitor work hours and optimize the 8-hour workday with visual timers and analytics.',
  },
  {
    title: 'Payroll Engine',
    description: 'Automated salary processing with tax calculations and compliance management.',
  },
  {
    title: 'Performance Reviews',
    description: 'Comprehensive employee evaluation system with customizable review cycles.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to streamline your HR operations
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient Image Placeholder */}
              <div className="h-48 gradient-hero relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-deep-purple opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-primary-foreground/20 text-6xl font-bold">
                    0{index + 1}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <button className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                  Learn More
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
