import React from "react";

const footerData = {
  title: "ReTrash",
  description: `Retrash adalah platform pengelolaan sampah modern yang membantu masyarakat 
memilah, mengumpulkan, dan mendaur ulang sampah dengan cara yang lebih praktis dan berkelanjutan.`,
  socialTitle: "Sosial Media",
  socialIcons: [
    {
      name: "Facebook",
      icon: "/assets/fb.png",
      link: "https://www.facebook.com/bank.sampah/",
    },
    {
      name: "X",
      icon: "/assets/x.png",
      link: "https://x.com/WWF_ID/status/1598628827978424320",
    },
    {
      name: "Instagram",
      icon: "/assets/ig.png",
      link: "https://www.instagram.com/banksampah.digital/",
    },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-[#018E48] text-white p-10 sm:px-20 lg:px-32 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 w-full">
        {/* KIRI */}
        <div className="w-full md:w-1/2 pr-0 md:pr-10">
          <h3 className="text-3xl font-bold mb-4">{footerData.title}</h3>
          <p className="text-sm leading-relaxed opacity-90">
            {footerData.description}
          </p>
        </div>

        {/* KANAN */}
        <div className="w-full md:w-auto text-left md:text-right">
          <h4 className="text-xl font-semibold mb-4">
            {footerData.socialTitle}
          </h4>

          <div className="flex justify-start md:justify-end space-x-4">
            {footerData.socialIcons.map((socmed, index) => (
              <a
                key={index}
                href={socmed.link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  bg-white text-green-700
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  hover:bg-gray-100 transition duration-300
                "
              >
                <img
                  src={socmed.icon}
                  alt={socmed.name}
                  className="w-5 h-5 object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
