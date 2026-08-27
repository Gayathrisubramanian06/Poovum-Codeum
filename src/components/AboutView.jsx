import React from 'react';
import { motion } from 'framer-motion';

export default function AboutView({ onNavigate }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col min-h-screen"
        >
            <header className="app-header" style={{ position: 'sticky', background: 'var(--cream)' }}>
                <button 
                    className="icon-btn" 
                    onClick={() => onNavigate('home')} 
                    aria-label="Back"
                    type="button"
                >
                    ←
                </button>
                <span className="title">About Onam</span>
                <button className="icon-btn" aria-label="Profile" type="button">👤</button>
            </header>

            <main className="page" style={{ flex: 1, padding: '24px 20px 40px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                <section className="fade-in visible">
                    <h1>What is Onam?</h1>
                    <p className="subtitle">A brief overview of the festival.</p>
                    <div 
                        style={{ 
                            background: 'var(--white)', 
                            borderRadius: '16px', 
                            padding: '24px', 
                            boxShadow: '0 4px 12px var(--shadow)' 
                        }}
                    >
                        <p style={{ marginBottom: '14px', lineHeight: '1.6' }}>
                            Onam is an annual harvest festival celebrated in the Indian state of Kerala. It is the official festival of the state and includes a spectrum of cultural events.
                        </p>
                        <p style={{ marginBottom: '14px', lineHeight: '1.6' }}>
                            According to legends, the festival is celebrated to commemorate King Mahabali, whose spirit is said to visit Kerala at the time of Onam.
                        </p>
                        <p style={{ lineHeight: '1.6' }}>
                            One of the most iconic parts of the celebration is the <strong>Pookalam</strong> (floral carpet), which is laid on the floor to welcome the King.
                        </p>
                    </div>
                </section>
            </main>
        </motion.div>
    );
}
