import React from "react";
import SectionContainer from "@/components/ui/SectionContainer";

const team = [
    {
        name: "Azizunnahar Sadeq",
        role: "Founder",
        bio: "A visionary leader with a passion for preserving traditional Bangladeshi craftsmanship. Azizunnahar pioneered the commercial introduction of paper quilling ornaments and continues to drive sustainable innovation across the artisan supply chain.",
    },
    {
        name: "Azitav Ahmed Revu",
        role: "CEO",
        bio: "With expertise in global trade and operations, Azitav leads Seasons Street's expansion into international markets. His strategic vision has forged partnerships with wholesale buyers across Europe, North America, and Oceania.",
    },
];

export default function TeamSection() {
    return (
        <SectionContainer id="team" background="charcoal-dark">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center">
                <span className="gold-underline">Meet the Team</span>
            </h2>

            {/* Team cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {team.map((member) => (
                    <div
                        key={member.name}
                        className="rounded-xl bg-surface border border-white/5 p-8 text-center card-hover"
                    >
                        {/* Avatar */}
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald to-emerald-dark border-3 border-gold/30 mx-auto mb-6 flex items-center justify-center">
                            <span className="text-3xl font-bold text-gold font-serif">
                                {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-1 font-serif">{member.name}</h3>
                        <p className="text-gold text-sm font-semibold mb-4 font-sans">
                            {member.role}
                        </p>
                        <p className="text-text-secondary text-sm leading-relaxed font-sans">
                            {member.bio}
                        </p>
                    </div>
                ))}
            </div>
        </SectionContainer>
    );
}
