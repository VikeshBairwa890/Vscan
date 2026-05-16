import { Button, Input, TextArea } from "@heroui/react";
import Image from "next/image";

export default function Profile() {
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-start justify-start w-full p-2 border-b">
                    <h1 className="text-2xl font-bold">Profile Page</h1>
                    <p className="text-lg text-gray-600">Welcome to your profile!</p>
                </div>
                <div className="flex flex-col justify-content-start w-125 p-2 border">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-xl">Profile settings</p>
                        <Button variant="primary">Save Profile</Button>
                    </div>
                    <div className='flex rotate-0 items-center justify-start mt-4'>
                        <Image src="/profile-pic.jpg" alt="VK" width={100} height={100} className="rounded-full border-2 border-blue-500 items-center" placeholder="empty" />
                        <div className="flex flex-col items-start justify-start ml-4">
                            <Input type="file" className="ml-4" placeholder="Upload logo" label="Logo" />
                            <span className="text-xs text-gray-500 ml-5 mt-1">Max 1MB. Rec: 320x240px</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-start mt-4 gap-5">
                        <Input type="text" label="Name" placeholder="Enter your name" className="w-full mb-4" />
                        <TextArea label="About (Bio)" placeholder="Welcome to our business. We are dedicated to providing the best service and quality products to our valued customers." className="w-full mb-4" rows={4} />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <Input type='text' label='Contact' placeholder='Enter your contact information' className="w-full mb-4" />
                        <Input type='text' label='Whatsapp' placeholder='Enter your whatsapp number' className="w-full mb-4 ml-4" />
                    </div>
                    <div className="flex flex-col items-start justify-start mt-4 gap-5">
                        <TextArea label='Business Address' placeholder='Enter your business address' className="w-full mb-4" rows={3} />
                        <Input type='text' label='Company Website' placeholder='Enter your website URL' className="w-full mb-4" />
                        <Input type='text' label='Google Review Link' placeholder='Enter your Google review URL' className="w-full mb-4" />
                    </div>
                </div>

                <div className="flex flex-col justify-content-start w-125 p-2 border mt-5">
                    <div className="flex row items-center justify-start gap-4">
                        {/* <W icon="credit-card" variant="primary" className="rounded-full p-2" /> */}
                        <p className=""> Payment Settings</p>
                    </div>
                    <div className='flex rotate-0 items-center justify-start mt-4'>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1">Payment QR Code</label>
                            <Image src="/payment-qr-code.png" alt="VK" width={100} height={100} className="rounded border-2 border-gray-300 items-center" placeholder="empty" />
                        </div>
                        <div className="flex row items-center justify-start gap-4 w-full">
                            <div className="flex flex-col items-start justify-start ml-4">
                                <Input type="file" className="ml-4" placeholder="Upload logo" label="Logo" />
                                <span className="text-xs text-gray-500 ml-5 mt-1">Max 1MB. Rec: 320x240px</span>
                            </div>
                            <div className="flex flex-col items-start justify-start ml-4 w-full">
                                <Input type='text' label='UPI ID' placeholder='Payment Link / UPI ID' className="w-full mb-4" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}