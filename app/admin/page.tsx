"use client";

import { useState, useEffect } from "react";

interface Registration {
  id: number;
  package: string;
  fullName: string;
  lineId: string;
  phone: string;
  email: string;
  facebook: string;
  referralCode: string | null;
  slipPath: string;
  needTaxInvoice: boolean;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  approved: "bg-green-900/50 text-green-300 border-green-700",
  rejected: "bg-red-900/50 text-red-300 border-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "รอตรวจสอบ",
  approved: "อนุมัติแล้ว",
  rejected: "ปฏิเสธ",
};

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/registrations");
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400 text-lg">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-950/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-bold text-white">
              KVid
            </a>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">Admin Dashboard</span>
          </div>
          <span className="text-sm text-slate-400">
            ทั้งหมด {registrations.length} รายการ
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">
          รายการสมัครทั้งหมด
        </h1>

        {registrations.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
            <p className="text-slate-400 text-lg">ยังไม่มีรายการสมัคร</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Info */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <span className="text-xs text-slate-500">ชื่อ-นามสกุล</span>
                      <p className="text-white font-medium">{reg.fullName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">แพ็กเกจ</span>
                      <p className="text-amber-400 font-medium">
                        {reg.package === "VIP" ? "👑 VIP MASTERCLASS" : "📦 STANDARD"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">สถานะ</span>
                      <p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs border ${
                            STATUS_COLORS[reg.status]
                          }`}
                        >
                          {STATUS_LABELS[reg.status]}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">LINE ID</span>
                      <p className="text-slate-300">{reg.lineId}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">เบอร์โทร</span>
                      <p className="text-slate-300">{reg.phone}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Email</span>
                      <p className="text-slate-300">{reg.email}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Facebook</span>
                      <p className="text-slate-300">{reg.facebook}</p>
                    </div>
                    {reg.referralCode && (
                      <div>
                        <span className="text-xs text-slate-500">
                          Referral Code
                        </span>
                        <p className="text-slate-300">{reg.referralCode}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs text-slate-500">วันที่สมัคร</span>
                      <p className="text-slate-300">
                        {new Date(reg.createdAt).toLocaleString("th-TH")}
                      </p>
                    </div>
                    {reg.needTaxInvoice && (
                      <div>
                        <span className="text-xs text-amber-400">
                          📄 ต้องการใบกำกับภาษี
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Slip + Actions */}
                  <div className="flex flex-col items-center gap-3 lg:w-48">
                    <button
                      type="button"
                      onClick={() => setSelectedSlip(reg.slipPath)}
                      className="w-full"
                    >
                      <img
                        src={reg.slipPath}
                        alt="สลิป"
                        className="w-full h-24 object-cover rounded border border-slate-600 hover:border-sky-500 transition-colors cursor-pointer"
                      />
                    </button>
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={() => updateStatus(reg.id, "approved")}
                        disabled={reg.status === "approved"}
                        className="flex-1 px-3 py-1.5 bg-green-800 hover:bg-green-700 text-green-200 text-sm rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        อนุมัติ
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(reg.id, "rejected")}
                        disabled={reg.status === "rejected"}
                        className="flex-1 px-3 py-1.5 bg-red-800 hover:bg-red-700 text-red-200 text-sm rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        ปฏิเสธ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Slip Modal */}
      {selectedSlip && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSlip(null)}
        >
          <div className="max-w-lg max-h-[90vh]">
            <img
              src={selectedSlip}
              alt="สลิปโอนเงิน"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-12">
        <p className="text-center text-slate-500 text-sm">
          © 2026 KVid Admin Dashboard
        </p>
      </footer>
    </div>
  );
}
