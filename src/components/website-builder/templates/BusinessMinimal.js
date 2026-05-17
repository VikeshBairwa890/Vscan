import { Phone, Mail, Clock } from "lucide-react";

export default function BusinessMinimal({ data }) {

    return (
        <div className="bg-white rounded-3xl overflow-hidden">
            <section className="p-12 text-center">

                <h1 className="text-5xl font-light">
                    {data.businessName}
                </h1>

                <p className="text-zinc-500 mt-4 text-lg">
                    {data.tagline}
                </p>

            </section>
            {data.showSections.hours && (
                <section className="px-10 pb-10">
                    <h2 className="text-2xl font-semibold mb-5">
                        Working Hours
                    </h2>
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
            {data.showSections.faqs && (
                <section className="px-10 pb-10">

                    <h2 className="text-2xl font-semibold mb-5">
                        FAQs
                    </h2>

                    <div className="space-y-4">

                        {data.faqs.map(f => (

                            <div
                                key={f.id}
                                className="border rounded-xl p-4"
                            >
                                <h3 className="font-medium">
                                    {f.question}
                                </h3>

                                <p className="text-zinc-500 mt-2">
                                    {f.answer}
                                </p>
                            </div>

                        ))}

                    </div>

                </section>

            )}

            {/* Contact */}

            {data.showSections.contact && (

                <section className="bg-zinc-50 p-10">

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