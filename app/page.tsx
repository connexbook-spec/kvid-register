"use client";

import { useState, useRef, FormEvent, DragEvent } from "react";

const PACKAGES = [
  {
    id: "GEM_A01",
    name: "🏪 GEM นักขายท้องถิ่น A01",
    price: 590,
    originalPrice: 2990,
    image: "/gem-a01.png",
    features: [
      "📩 รับ GEM ทางเมลภายใน 24 ชั่วโมง!!!",
      "🎬 คลิปสอนการใช้งานความยาว 49 นาที (เรียนจบทำตามได้ทันที)",
    ],
  },
  {
    id: "GEM_A02",
    name: "📦 GEM นักขายโกดังระเบิด A02",
    price: 590,
    originalPrice: 2990,
    features: [
      "📩 รับ GEM ทางเมลภายใน 24 ชั่วโมง!!!",
      "🎬 คลิปสอนการใช้งานความยาว 59 นาที (เรียนจบทำตามได้ทันที)",
    ],
  },
  {
    id: "GEM_COMBO",
    name: "🔥 โปรแพ็คคู่!!! (A01 & A02)",
    price: 990,
    originalPrice: 5980,
    features: [
      "🏪 GEM นักขายท้องถิ่น A01 + 📦 GEM นักขายโกดังระเบิด A02",
      "📩 รับทั้ง 2 GEM ทางเมลภายใน 24 ชั่วโมง!!!",
      "🎬 คลิปสอนการใช้งานทั้ง 2 GEM (เรียนจบทำตามได้ทันที)",
    ],
  },
];

const BANK_INFO = {
  bank: "ธนาคารไทยพาณิชย์ (SCB)",
  accountNumber: "4361832348",
  accountName: "บริษัท คอนเน็กซ์บุ๊ค จำกัด",
};

export default function RegisterPage() {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [fullName, setFullName] = useState("");
  const [lineId, setLineId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [needTaxInvoice, setNeedTaxInvoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      alert("รองรับเฉพาะไฟล์ JPG, PNG เท่านั้น");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("ขนาดไฟล์ต้องไม่เกิน 5MB");
      return;
    }
    setSlipFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setSlipPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const copyAccountNumber = async () => {
    await navigator.clipboard.writeText(BANK_INFO.accountNumber.replace(/-/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) {
      alert("กรุณาเลือกแพ็กเกจ");
      return;
    }
    if (!slipFile) {
      alert("กรุณาแนบสลิปโอนเงิน");
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const formData = new FormData();
    formData.append("package", selectedPackage);
    formData.append("fullName", fullName);
    formData.append("lineId", lineId);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("facebook", facebook);
    formData.append("referralCode", referralCode);
    formData.append("needTaxInvoice", String(needTaxInvoice));
    formData.append("slip", slipFile);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitResult({
          success: true,
          message: "สมัครเรียบร้อยแล้ว! ระบบจะตรวจสอบสลิปและยืนยันการสมัครให้คุณ",
        });
        // Reset form
        setSelectedPackage("");
        setFullName("");
        setLineId("");
        setPhone("");
        setEmail("");
        setFacebook("");
        setReferralCode("");
        setSlipFile(null);
        setSlipPreview(null);
        setNeedTaxInvoice(false);
      } else {
        setSubmitResult({ success: false, message: data.error || "เกิดข้อผิดพลาด" });
      }
    } catch {
      setSubmitResult({ success: false, message: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-950/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <span className="text-xl font-bold text-white">GEMinw</span>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="w-full bg-slate-950">
        <img
          src="/banner.png"
          alt="GEM โกยยอดขาย 7 หลัก ด้วย Ai ปักตะกร้า ฉบับนายหน้า TikTok"
          className="w-full object-contain"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
          GEM โกยยอดขาย 7 หลัก<br />
          ด้วย Ai ปักตะกร้า<br />
          ฉบับนายหน้า TikTok
        </h2>
        <p className="text-slate-400 text-center mb-8">กรอกข้อมูลเพื่อสมัคร</p>

        {/* Success/Error Message */}
        {submitResult && (
          <div
            className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg text-center ${
              submitResult.success
                ? "bg-green-900/50 border border-green-700 text-green-300"
                : "bg-red-900/50 border border-red-700 text-red-300"
            }`}
          >
            {submitResult.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Packages + Bank Info */}
            <div className="space-y-6">
              {/* Package Selection */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">
                  แพ็กเกจที่เลือกได้
                </h3>
                <div className="space-y-4">
                  {PACKAGES.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedPackage === pkg.id
                          ? "border-sky-500 bg-sky-950/50"
                          : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
                      }`}
                    >
                      {pkg.image && (
                        <img
                          src={pkg.image}
                          alt={pkg.name}
                          className="w-full rounded-lg mb-3"
                        />
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-white">{pkg.name}</span>
                        <div className="text-right shrink-0 ml-2">
                          {pkg.originalPrice && (
                            <span className="text-slate-500 line-through text-sm block">
                              ฿{pkg.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-amber-400 font-bold text-lg">
                            ฿{pkg.price.toLocaleString()}.-
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {pkg.features.map((f, i) => (
                          <p key={i} className="text-sm text-slate-300">
                            {f}
                          </p>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Info */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">
                  ข้อมูลการโอนเงิน
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ธนาคาร</span>
                    <span className="text-white font-medium">{BANK_INFO.bank}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">เลขบัญชี</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-lg">
                        {BANK_INFO.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={copyAccountNumber}
                        className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                      >
                        📋 {copied ? "คัดลอกแล้ว!" : "คัดลอก"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ชื่อบัญชี</span>
                    <span className="text-white font-medium">
                      {BANK_INFO.accountName}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
                  <p className="text-amber-300 text-sm">
                    หลังโอนเงินแล้ว กรุณาแนบสลิปเพื่อยืนยันการชำระเงิน
                    ระบบจะตรวจสอบสลิปอัตโนมัติ
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-3">
                กรอกข้อมูลสมัคร
              </h3>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="กรอกชื่อ-นามสกุล"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* LINE ID */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    LINE ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lineId}
                    onChange={(e) => setLineId(e.target.value)}
                    placeholder="กรอก LINE ID"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      เบอร์โทรศัพท์ <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812345678"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Gemini Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Email ที่ใช้งาน Gemini <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="Email ที่ใช้งาน Gemini สำหรับเพิ่ม GEM ให้ใช้งาน"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Referral Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Referral Code{" "}
                    <span className="text-slate-500 font-normal">(ถ้ามี)</span>
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="กรอก REFERRAL CODE"
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                {/* Slip Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    แนบสลิปโอนเงิน <span className="text-red-400">*</span>
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-sky-400 bg-sky-950/30"
                        : slipPreview
                        ? "border-green-600 bg-green-950/20"
                        : "border-slate-600 hover:border-slate-500 bg-slate-900/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      className="hidden"
                    />
                    {slipPreview ? (
                      <div>
                        <img
                          src={slipPreview}
                          alt="สลิปโอนเงิน"
                          className="max-h-40 mx-auto rounded mb-2"
                        />
                        <p className="text-green-400 text-sm">{slipFile?.name}</p>
                        <p className="text-slate-500 text-xs mt-1">
                          คลิกเพื่อเปลี่ยนไฟล์
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl mb-2">↑</div>
                        <p className="text-slate-400">
                          ลากไฟล์หรือ{" "}
                          <span className="text-sky-400 font-semibold">
                            คลิกเพื่อเลือกไฟล์
                          </span>
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                          รองรับ JPG, PNG ขนาดไม่เกิน 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Tax Invoice */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needTaxInvoice}
                    onChange={(e) => setNeedTaxInvoice(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-slate-300">ต้องการใบกำกับภาษี</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-lg rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isSubmitting ? "กำลังส่งข้อมูล..." : "สมัครเรียนและชำระเงิน"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 mt-12">
        <p className="text-center text-slate-500 text-sm">
          © 2026 GEMinw. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
