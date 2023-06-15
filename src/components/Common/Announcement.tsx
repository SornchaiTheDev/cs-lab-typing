import { Icon } from "@iconify/react";
import React from "react";

function Announcement() {
  return (
    <div className="flex flex-col gap-2 p-2 my-2 border-l-4 rounded-md border-yellow-10 bg-yellow-5">
      <div className="flex items-center gap-2">
        <Icon icon="solar:pin-bold-duotone" />
        <h2 className="text-lg font-bold">ประกาศปิดระบบเพื่อเตรียมสอบ</h2>
      </div>
      <div className="max-w-full prose">
        <p>
          ขอให้นิสิตงดการเข้าใช้งานระบบ
          และให้นิสิตออกจากระบบทันทีที่เห็นข้อความนี้ จนกว่าจะถึงเวลาสอบ
          (วันอังคารที่ 15 พฤษภาคม 2561 เลา 13.00 - 16.00 น.)
          นิสิตที่ไม่ปฏิบัติตาม จะหัก 10% จากคะแนนสอบที่ทำได้
          ให้นิสิตติดตามข่าวสารและประกาศอื่นที่ facebook group ของรายวิชา
        </p>
      </div>
    </div>
  );
}

export default Announcement;
