import { Instagram, Github } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const developers = [
    { name: "김현진", github: "https://github.com/hj7321" },
    { name: "김희서", github: "https://github.com/hesseo" },
    { name: "안선아", github: "https://github.com/asun1207" },
    { name: "조은빈", github: "https://github.com/choeunbin03" },
  ];

  const services = [
    { name: "AI 문장 변환", path: "/ai-paraphrase" },
    { name: "AI 요약", path: "/ai-summarize" },
    { name: "인용 생성", path: "/create-citation" },
  ];

  return (
    <footer className="bg-main/20 pt-[50px] md:pt-[200px]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* 상단: Service / (GitHub Repo + Instagram) */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-8">
          {/* Service: 모바일 중앙, 데스크탑 좌측 */}
          <div className="text-center md:text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-6">
              Service
            </h3>
            <nav className="flex flex-col gap-4 items-center md:items-start">
              {services.map((service) => (
                <Link
                  key={service.path}
                  href={service.path}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {service.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* 우측: GitHub Repo / Instagram → 모바일에서 중앙 세로 정렬 */}
          <div className="flex flex-col items-center md:items-end gap-3">
            {/* GitHub Repo (고정 너비) */}
            <a
              href="https://github.com/SSU-IT-Contest"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-[170px] justify-center items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background font-medium text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
              aria-label="Visit our GitHub repository"
            >
              <Github className="w-4 h-4" />
              <span>SSU-IT-Contest</span>
            </a>

            {/* Instagram (같은 너비로 맞춤) */}
            <a
              href="https://www.instagram.com/phrai.z?igsh=bjQ5eXJ1MTB3OGx4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-[170px] justify-center items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#4F5BD5] via-[#962FBF] via-[#D62976] via-[#FA7E1E] via-[#F56040] via-[#E1306C] via-[#FD1D1D] via-[#F77737] via-[#FCAF45] to-[#FFDC80] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all hover:scale-105"
              aria-label="Visit our Instagram"
            >
              <Instagram className="w-4 h-4" />
              <span>phrai.z</span>
            </a>
          </div>
        </div>

        {/* Development Team */}
        <div className="pt-8 mb-8">
          <h4 className="text-sm font-semibold text-center mb-4 text-muted-foreground">
            Development Team
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {developers.map((dev) => (
              <a
                key={dev.name}
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-background/50 hover:bg-background border border-main/20 hover:border-main/40 transition-all group"
              >
                <Github className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="text-sm font-medium">{dev.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] md:text-[12px] text-muted-foreground">
          <p>2025 IT Project | Soongsil University</p>
          <p>Copyright © 2025 Codiva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
