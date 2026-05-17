import { Phone, Mail, MapPin, } from "lucide-react";

export default function BusinessModern({
    data
}) {

    return (
        <div className="bg-zinc-950 text-white rounded-3xl overflow-hidden">

            {/* Announcement */}
            {data.showSections.announcement &&
                data.announcement.enabled && (
                    <div className="bg-blue-600 text-center py-3 text-sm">
                        {data.announcement.text}
                    </div>
                )}

            {/* Hero */}

            <section className="p-10 md:p-16">

                <h1 className="text-5xl md:text-6xl font-bold">
                    {data.businessName}
                </h1>

                <p className="text-blue-300 text-xl mt-4">
                    {data.tagline}
                </p>

                <div className="flex flex-wrap gap-4 mt-8">

                    <button className="bg-blue-600 px-6 py-3 rounded-xl">
                        {data.buttonText}
                    </button>

                    <button className="border border-zinc-700 px-6 py-3 rounded-xl">
                        Learn More
                    </button>

                </div>

            </section>

            {/* Services */}

            {data.showSections.services && (

                <section className="px-10 pb-12">

                    <h2 className="text-3xl font-bold mb-6">
                        Services
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                        {data.services.map(service => (

                            <div
                                key={service.id}
                                className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800"
                            >
                                <h3 className="font-semibold text-xl">
                                    {service.name}
                                </h3>

                                <p className="text-blue-400 mt-2">
                                    {service.price}
                                </p>

                                <p className="text-zinc-400 mt-3">
                                    {service.desc}
                                </p>
                            </div>

                        ))}

                    </div>

                </section>

            )}

            {/* Testimonials */}

            {data.showSections.testimonials && (

                <section className="px-10 pb-12">

                    <h2 className="text-3xl font-bold mb-6">
                        Testimonials
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                        {data.testimonials.map(t => (

                            <div
                                key={t.id}
                                className="bg-zinc-900 rounded-2xl p-5"
                            >
                                <p className="text-zinc-300">
                                    {t.content}
                                </p>

                                <div className="mt-4 text-blue-300">
                                    — {t.name}
                                </div>
                            </div>

                        ))}

                    </div>

                </section>

            )}

            {/* Contact */}

            {data.showSections.contact && (

                <section className="bg-zinc-900 p-10">

                    <h2 className="text-3xl font-bold mb-6">
                        Contact
                    </h2>

                    <div className="space-y-4">

                        <div className="flex gap-3">
                            <Phone size={18} />
                            {data.phone}
                        </div>

                        <div className="flex gap-3">
                            <Mail size={18} />
                            {data.email}
                        </div>

                        <div className="flex gap-3">
                            <MapPin size={18} />
                            {data.address}
                        </div>

                    </div>

                </section>

            )}

        </div>
    );
}