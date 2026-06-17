import { Phone, Mail, Clock } from "lucide-react";

export default function BusinessMinimal({ data }) {
    const sh = data.sectionHeaders || {};

    return (
        <div className="bg-white rounded-3xl overflow-hidden">
            <section className="p-12 text-center">
                <h1 className="text-5xl font-light">
                    {data.title || data.businessName}
                </h1>
                <p className="text-zinc-500 mt-4 text-lg max-w-lg mx-auto leading-relaxed">
                    {data.tagline}
                </p>
            </section>

            {data.showSections?.about && data.aboutSection?.body && (
                <section className="px-10 pb-10" id="about">
                    <h2 className="text-2xl font-semibold mb-2">
                        {data.aboutSection.title || sh.about?.title || "About Us"}
                    </h2>
                    {(data.aboutSection.subtitle || sh.about?.subtitle) && (
                        <p className="text-zinc-500 text-sm mb-5 leading-relaxed">
                            {data.aboutSection.subtitle || sh.about?.subtitle}
                        </p>
                    )}
                    <div className="text-zinc-600 text-sm leading-relaxed space-y-4">
                        {data.aboutSection.body.split(/\n\n+/).map((para, i) => (
                            <p key={i}>{para.trim()}</p>
                        ))}
                    </div>
                </section>
            )}

            {data.showSections?.services && data.services?.length > 0 && (
                <section className="px-10 pb-10">
                    <h2 className="text-2xl font-semibold mb-2">
                        {sh.services?.title || "Our Services"}
                    </h2>
                    {sh.services?.subtitle && (
                        <p className="text-zinc-500 text-sm mb-5">{sh.services.subtitle}</p>
                    )}
                    <div className="space-y-4">
                        {data.services.map((s) => (
                            <div key={s.id} className="border rounded-xl p-4">
                                <div className="flex justify-between items-start gap-2">
                                    <h3 className="font-medium">{s.name}</h3>
                                    <span className="text-sm font-semibold text-zinc-700">{s.price}</span>
                                </div>
                                {s.desc && (
                                    <p className="text-zinc-500 mt-2 text-sm leading-relaxed">{s.desc}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.showSections?.hours && (
                <section className="px-10 pb-10">
                    <h2 className="text-2xl font-semibold mb-2">
                        {sh.hours?.title || "Working Hours"}
                    </h2>
                    {sh.hours?.subtitle && (
                        <p className="text-zinc-500 text-sm mb-5">{sh.hours.subtitle}</p>
                    )}
                    <div className="space-y-3">
                        {data.hours.map((h, i) => (
                            <div key={i} className="flex justify-between border-b pb-2">
                                <span>{h.day}</span>
                                <span className="text-zinc-500">{h.time}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.showSections?.faqs && (
                <section className="px-10 pb-10">
                    <h2 className="text-2xl font-semibold mb-2">
                        {sh.faqs?.title || "Frequently Asked Questions"}
                    </h2>
                    {sh.faqs?.subtitle && (
                        <p className="text-zinc-500 text-sm mb-5 leading-relaxed">{sh.faqs.subtitle}</p>
                    )}
                    <div className="space-y-4">
                        {data.faqs.map(f => (
                            <div key={f.id} className="border rounded-xl p-4">
                                <h3 className="font-medium">{f.question}</h3>
                                <p className="text-zinc-500 mt-2 text-sm leading-relaxed">{f.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.showSections?.contact && (
                <section className="bg-zinc-50 p-10">
                    <h2 className="text-xl font-semibold mb-4">
                        {sh.contact?.title || "Contact Us"}
                    </h2>
                    {sh.contact?.subtitle && (
                        <p className="text-zinc-500 text-sm mb-4">{sh.contact.subtitle}</p>
                    )}
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <Phone size={18} />
                            {data.phone}
                        </div>
                        <div className="flex gap-3">
                            <Mail size={18} />
                            {data.email}
                        </div>
                        <div className="flex gap-3">
                            <Clock size={18} />
                            {data.address}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
