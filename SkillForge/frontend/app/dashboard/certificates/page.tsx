"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CertificateCard } from "@/components/certificate-card";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCertificates } from "@/lib/database";

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const data = await getCertificates();
        setCertificates(data || []);
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const handleStartInterview = () => {
    router.push("/dashboard/interview?new=true");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground">Your achievements and credentials</p>
        </div>
        <Button onClick={handleStartInterview}>
          <Plus className="w-4 h-4 mr-2" />
          Earn New Certificate
        </Button>
      </div>

      {certificates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CertificateCard 
                certificate={{
                  id: certificate.id,
                  role: certificate.role,
                  score: certificate.score,
                  date: new Date(certificate.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }),
                  minted: certificate.minted,
                }} 
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
          <p className="text-muted-foreground mb-6">
            Complete an interview to earn your first certificate
          </p>
          <Button onClick={handleStartInterview}>
            <Plus className="w-4 h-4 mr-2" />
            Start Interview
          </Button>
        </div>
      )}
    </div>
  );
}
