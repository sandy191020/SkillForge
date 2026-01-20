"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, CheckCircle2 } from "lucide-react";

interface CertificateCardProps {
  certificate: {
    id?: string;
    role: string;
    score: number;
    date: string;
    date: string;
  };
}

export function CertificateCard({ certificate }: CertificateCardProps) {
  const handleDownload = () => {
    alert("Download functionality not implemented yet.");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SkillForge Certificate',
          text: `I just earned a ${certificate.role} certificate on SkillForge!`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    }




    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300"
      >
        {/* Decorative Top Border */}
        < div className="h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500" />

        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-violet-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8 text-violet-600" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-violet-700 transition-colors">
                {certificate.role}
              </h3>
              <p className="text-sm text-slate-500">Completed on {certificate.date}</p>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-slate-100">
              <div className="text-sm text-slate-600">Score Achieved</div>
              <div className="text-lg font-bold text-violet-600">{certificate.score}%</div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                className="w-full gap-2 hover:text-violet-600 hover:border-violet-200"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 hover:text-violet-600 hover:border-violet-200"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>

            </div>
          </div>
      </motion.div >
    )
  }
