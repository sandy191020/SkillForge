"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Download, Share2, Loader2 } from "lucide-react";
import { getInterviewResult, saveCertificate, getUserName } from "@/lib/database";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function GenerateCertificatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const certificateRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [interviewData, setInterviewData] = useState<any>(null);
  const [userName, setUserName] = useState("User");
  const [certificateId, setCertificateId] = useState<string | null>(null);

  const interviewId = searchParams.get('interviewId');

  useEffect(() => {
    const loadData = async () => {
      if (!interviewId) {
        router.push('/dashboard/certificates');
        return;
      }

      try {
        const [interview, name] = await Promise.all([
          getInterviewResult(interviewId),
          getUserName()
        ]);
        
        setInterviewData(interview);
        setUserName(name || "User");
      } catch (error) {
        console.error('Error loading interview data:', error);
        alert('Failed to load interview data');
        router.push('/dashboard/certificates');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [interviewId, router]);

  const handleGenerateCertificate = async () => {
    if (!interviewData) return;
    
    setGenerating(true);
    try {
      // Save certificate to database
      const certificate = await saveCertificate(
        interviewData.id,
        interviewData.role,
        interviewData.score,
        {
          userName,
          date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          strengths: interviewData.strengths,
          weaknesses: interviewData.weaknesses,
        }
      );
      
      setCertificateId(certificate.id);
      alert('Certificate generated successfully!');
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!certificateRef.current) {
      alert('Certificate not ready. Please try again.');
      return;
    }

    try {
      // Wait for everything to render
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Capture the certificate with high quality
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#f5f3ff',
        useCORS: true,
        allowTaint: true,
        logging: true,
      });

      // Calculate PDF dimensions to fit the certificate
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF in landscape if certificate is wider
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Add image to PDF (centered)
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate position to center the image
      const xPos = (pdfWidth - imgWidth) / 2;
      const yPos = (pdfHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', Math.max(0, xPos), Math.max(0, yPos), imgWidth, imgHeight);

      // Download
      const fileName = `skillforge-certificate-${interviewData?.role.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      pdf.save(fileName);

    } catch (error: any) {
      console.error('Error downloading certificate:', error);
      alert(`Failed to download certificate: ${error.message}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SkillForge Certificate',
        text: `I earned a certificate in ${interviewData?.role} with a score of ${interviewData?.score}%!`,
        url: window.location.href,
      });
    } else {
      alert('Sharing not supported on this device');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!interviewData) {
    return null;
  }

  const certificateDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Generate Certificate</h1>
        <p className="text-muted-foreground">Your achievement is ready to be certified</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Certificate Preview */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div 
              ref={certificateRef}
              className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 p-12 md:p-16"
            >
              {/* Decorative Border */}
              <div className="absolute inset-4 border-4 border-purple-200 rounded-lg"></div>
              <div className="absolute inset-6 border-2 border-purple-100 rounded-lg"></div>

              {/* Content */}
              <div className="relative z-10 text-center space-y-6">
                {/* Logo/Icon */}
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-xl">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                    SkillForge
                  </h2>
                  <p className="text-xl text-gray-600">Certificate of Achievement</p>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-20 bg-gradient-to-r from-transparent to-purple-300"></div>
                  <Award className="w-6 h-6 text-purple-400" />
                  <div className="h-px w-20 bg-gradient-to-l from-transparent to-purple-300"></div>
                </div>

                {/* Recipient */}
                <div className="space-y-2">
                  <p className="text-lg text-gray-600">This is to certify that</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {userName}
                  </h3>
                  <p className="text-lg text-gray-600">has successfully completed</p>
                </div>

                {/* Role */}
                <div className="py-4">
                  <h4 className="text-2xl md:text-3xl font-bold text-purple-600">
                    {interviewData.role}
                  </h4>
                  <p className="text-lg text-gray-600 mt-2">Interview Assessment</p>
                </div>

                {/* Score Badge */}
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full shadow-lg">
                    <p className="text-sm font-medium">Score</p>
                    <p className="text-3xl font-bold">{interviewData.score}%</p>
                  </div>
                </div>

                {/* Date */}
                <div className="pt-6">
                  <p className="text-gray-600">{certificateDate}</p>
                </div>

                {/* Signature Line */}
                <div className="pt-8 flex justify-center gap-16">
                  <div className="text-center">
                    <div className="border-t-2 border-gray-400 w-40 mb-2"></div>
                    <p className="text-sm text-gray-600">SkillForge AI</p>
                    <p className="text-xs text-gray-500">Authorized Signature</p>
                  </div>
                </div>

                {/* Certificate ID */}
                {certificateId && (
                  <div className="pt-4">
                    <p className="text-xs text-gray-400 font-mono">
                      Certificate ID: {certificateId.slice(0, 8)}...{certificateId.slice(-8)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          {!certificateId ? (
            <Button 
              className="flex-1" 
              size="lg"
              onClick={handleGenerateCertificate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Generate Certificate
                </>
              )}
            </Button>
          ) : (
            <>
              <Button 
                className="flex-1" 
                size="lg"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                className="flex-1" 
                size="lg"
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                className="flex-1" 
                size="lg"
                variant="outline"
                onClick={() => router.push('/dashboard/certificates')}
              >
                View All Certificates
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
