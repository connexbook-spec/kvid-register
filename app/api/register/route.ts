import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendLineNotify } from "@/lib/line-notify";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const pkg = formData.get("package") as string;
    const fullName = formData.get("fullName") as string;
    const lineId = formData.get("lineId") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const facebook = formData.get("facebook") as string;
    const referralCode = (formData.get("referralCode") as string) || null;
    const needTaxInvoice = formData.get("needTaxInvoice") === "true";
    const slip = formData.get("slip") as File | null;

    // Validation
    if (!pkg || !fullName || !lineId || !phone || !email || !facebook) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    if (!slip) {
      return NextResponse.json(
        { error: "กรุณาแนบสลิปโอนเงิน" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!slip.type.match(/^image\/(jpeg|png)$/)) {
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์ JPG, PNG" },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (slip.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "ขนาดไฟล์ต้องไม่เกิน 5MB" },
        { status: 400 }
      );
    }

    // Convert to base64 data URL (works on serverless)
    const buffer = Buffer.from(await slip.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${slip.type};base64,${base64}`;

    // Save to database
    const registration = await prisma.registration.create({
      data: {
        package: pkg,
        fullName,
        lineId,
        phone,
        email,
        facebook,
        referralCode,
        slipPath: dataUrl,
        needTaxInvoice,
      },
    });

    // Send LINE Notify
    const pkgNames: Record<string, string> = {
      GEM_A01: "GEM นักขายท้องถิ่น A01 (590.-)",
      GEM_A02: "GEM นักขายโกดังระเบิด A02 (590.-)",
      GEM_COMBO: "โปรแพ็คคู่ A01+A02 (990.-)",
    };
    await sendLineNotify(
      `\n📋 สมัครใหม่ #${registration.id}\n` +
      `📦 ${pkgNames[pkg] || pkg}\n` +
      `👤 ${fullName}\n` +
      `📱 ${phone}\n` +
      `📧 ${email}\n` +
      `💬 LINE: ${lineId}\n` +
      `🔗 ดูรายละเอียด: https://geminw-register.vercel.app/admin`
    );

    return NextResponse.json({
      success: true,
      id: registration.id,
      message: "สมัครเรียบร้อยแล้ว",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}
