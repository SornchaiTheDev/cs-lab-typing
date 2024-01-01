import Image from "next/image";
import logo from "~/assets/logo.png";
function Header() {
  return (
    <>
      <Image src={logo} alt="CS Lab logo" className="mb-6 w-24" />
      <h1 className="mb-2 text-center text-4xl font-semibold text-sand-12">
        CS LAB
      </h1>

      {/* <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse bg-emerald-500"></div>
                <p className="text-center dark:text-ascent-1">
                    ขณะนี้มีผู้ใช้งานอยู่ {userCount} คน
                </p>
            </div> */}
    </>
  );
}

export default Header;
