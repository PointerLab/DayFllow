import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Plug, Headphones } from 'lucide-react';

const reasons = [
  {
    icon: Users,
    title: '10,000+ Teams',
    description: 'Trusted by companies worldwide to manage their workforce efficiently.',
  },
  {
    icon: DollarSign,
    title: 'No Hidden Fees',
    description: 'Transparent pricing with no surprise charges. What you see is what you pay.',
  },
  {
    icon: Plug,
    title: 'Seamless Integration',
    description: 'Connect with your existing tools and workflows in minutes, not days.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated support team is always ready to help you succeed.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export const ReasonsSection: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of companies that have transformed their HR operations
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group p-8 bg-card border border-border rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2"
            >
              <div className="p-4 bg-lavender rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                <reason.icon size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ReasonsSection;
