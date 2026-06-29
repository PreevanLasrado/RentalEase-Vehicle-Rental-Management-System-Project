import { useEffect } from "react";
import {
  X,
  Bell,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  BadgeInfo,
  CheckCircle2,
} from "lucide-react";

const Notification = ({
  isOpen,
  onClose,
  notifications,
  markAsRead,
}) => {

  // DISABLE SCROLL
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BLUR */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      {/* MODAL */}
      <div className="relative w-[95%] max-w-2xl h-[94vh] bg-[#fff8f2] rounded-[38px] overflow-hidden shadow-2xl border border-orange-200">

        {/* HEADER */}
        <div className="sticky z-20 bg-white/90 backdrop-blur-xl border-b border-orange-200 px-5 py-5 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
              <Bell className="text-white" size={28} />
            </div>

            <div>
              <h1 className="text-4xl font-black text-[#2b0d00] tracking-tight">
                Notifications
              </h1>

              <p className="text-gray-500 text-[16px] mt-1">
                Contact messages from users
              </p>
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-orange-100 hover:bg-orange-500 transition-all duration-300 flex items-center justify-center group"
          >
            <X
              className="text-orange-500 group-hover:text-white"
              size={26}
            />
          </button>
        </div>

        {/* BODY */}
        <div className="h-[calc(94vh-110px)] overflow-y-auto p-2 space-y-2">

          {notifications.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center">

              <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center mb-6">
                <Bell className="text-orange-500" size={50} />
              </div>

              <h2 className="text-4xl font-black text-[#2b0d00]">
                No Notifications
              </h2>

              <p className="text-gray-500 mt-2 text-xl">
                New messages will appear here
              </p>
            </div>

          ) : (

            notifications.map((item) => (

              <div
                key={item._id}
                className={`rounded-[36px] p-6 border transition-all duration-300 shadow-sm hover:shadow-xl ${
                  item.read === true
                    ? "bg-white border-orange-200"
                    : "border-orange-300"
                }`}
              >

                {/* TOP */}
                <div className="flex items-start justify-between mb-6">

                  {/* LEFT */}
                  <div>

                    <h2 className="text-[24px] leading-none font-black text-[#2b0d00]">
                      {item.name
                        ?.split(" ")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                        )
                        .join(" ")}
                    </h2>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">

                    <p className="text-[14px] text-gray-900 font-medium">
                      Message Sent At
                    </p>

                    <p className="text-[#2b0d00] font-black text-[14px]">
                      {new Date(item.createdAt).toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* INFO GRID */}
                <div className="grid grid-cols-3 gap-18 mb-6">

                  {/* EMAIL */}
                  <div>

                    <div className="flex items-center -ml-4">

                      <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        <Mail
                          className="text-orange-600"
                          size={20}
                        />
                      </div>

                      <div>
                        <p className="text-orange-500 font-black text-[16px]">
                          Email
                        </p>

                        <h3 className="text-[#2b0d00] text-[14px] font-bold mt-1 break-all">
                          {item.email}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* PHONE */}
                  <div>

                    <div className="flex items-center ml-6">

                      <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        <Phone
                          className="text-orange-600"
                          size={20}
                        />
                      </div>

                      <div>
                        <p className="text-orange-500 font-black text-[16px]">
                          Phone
                        </p>

                        <h3 className="text-[#2b0d00] text-[14px] font-bold  mt-1 break-all">
                          +91 {item.phone}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* CITY */}
                  <div>

                    <div className="flex items-center ml-16">

                      <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        <MapPin
                          className="text-orange-600"
                          size={20}
                        />
                      </div>

                      <div>
                        <p className="text-orange-500 font-black text-[16px]">
                          City
                        </p>

                        <h3 className="text-[#2b0d00] text-[14px] font-bold mt-1">
                          {item.city}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SUBJECT */}
                <div className="mb-2">

                  <div className="flex items-center -ml-4">

                    {/* ICON */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">

                      <BadgeInfo
                        className="text-orange-600"
                        size={25}
                      />
                    </div>

                    {/* SUBJECT TEXT */}
                    <div className="flex items-center gap-5">

                      <h2 className="text-[16px] font-black uppercase text-orange-500">
                        Subject :
                      </h2>

                      <div className="text-black font-bold text-[14px]">
                        {item.subject}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MESSAGE */}
                <div className="-mb-3">

                  {/* HEADER */}
                  <div className="flex items-center -ml-4">

                    {/* ICON */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">

                      <MessageSquare
                        className="text-orange-600"
                        size={19}
                      />
                    </div>

                    {/* TITLE */}
                    <h2 className="text-[16px] font-bold uppercase text-orange-500">
                      Message :
                    </h2>
                  </div>

                  {/* MESSAGE BOX */}
                  <div className="relative flex items-center">

                    {/* MESSAGE TEXT */}
                    <div className="px-8 -mt-2 w-full">

                      <p className="w-full max-w-[80%] break-words whitespace-pre-wrap overflow-hidden text-[14px] leading-[25px] font-bold text-black">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BUTTON */}
                {!item.read && (

                  <div className="flex justify-end -mt-8 -mb-4">

                    <button
                        onClick={() =>
                        markAsRead(item._id)
                        }
                        className="-mr-3 px-2 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 hover:scale-105 transition-all duration-300 text-white font-black text-[12px] shadow-xl shadow-orange-500/30 flex items-center gap-1"
                    >
                        <CheckCircle2 size={16} />

                        Mark as Read
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;