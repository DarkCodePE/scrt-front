import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultCardProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    delay?: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({
                                                          title,
                                                          children,
                                                          icon,
                                                          className = '',
                                                          delay = 0
                                                      }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
        >
            <Card className={`backdrop-blur-sm bg-white/10 border-none ${className}`}>
                <CardHeader className="flex flex-row items-center space-x-2">
                    {icon && <div className="w-8 h-8 text-primary">{icon}</div>}
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>{children}</CardContent>
            </Card>
        </motion.div>
    );
};