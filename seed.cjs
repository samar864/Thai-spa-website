"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var settings, _i, settings_1, s, therapists, _a, therapists_1, t, services, _b, services_1, s, nextWeek, offers, _c, offers_1, o, reviews, _d, reviews_1, r, firstService;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log("Seeding Baan Bua Spa database...");
                    // Clear existing data
                    return [4 /*yield*/, prisma.appointment.deleteMany()];
                case 1:
                    // Clear existing data
                    _e.sent();
                    return [4 /*yield*/, prisma.review.deleteMany()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, prisma.offer.deleteMany()];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, prisma.service.deleteMany()];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, prisma.therapist.deleteMany()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, prisma.blockedSlot.deleteMany()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, prisma.enquiry.deleteMany()];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, prisma.setting.deleteMany()
                        // Seed Settings
                    ];
                case 8:
                    _e.sent();
                    settings = [
                        { key: 'spa_name', value: 'Baan Bua Spa' },
                        { key: 'tagline', value: 'Relax. Rejuvenate. Rediscover Yourself.' },
                        { key: 'currency', value: '฿' },
                        { key: 'address', value: '88/1 Sukhumvit Soi 39, Phrom Phong, Watthana, Bangkok 10110, Thailand' },
                        { key: 'phone', value: '+66 2 123 4567' },
                        { key: 'whatsapp', value: '66812345678' },
                        { key: 'email', value: 'concierge@baanbuaspa.com' },
                        { key: 'open_time', value: '10:00' },
                        { key: 'close_time', value: '22:00' },
                        { key: 'last_appointment', value: '21:00' },
                        { key: 'timezone', value: 'Asia/Bangkok' },
                        { key: 'admin_password', value: 'spa2026' },
                        { key: 'cancellation_policy', value: 'Appointments may be cancelled or rescheduled up to 4 hours before the scheduled appointment. Late cancellations or no-shows may be subject to a 50% cancellation fee.' }
                    ];
                    _i = 0, settings_1 = settings;
                    _e.label = 9;
                case 9:
                    if (!(_i < settings_1.length)) return [3 /*break*/, 12];
                    s = settings_1[_i];
                    return [4 /*yield*/, prisma.setting.create({ data: s })];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12:
                    therapists = [
                        { name: 'Any Available Therapist', title: 'Senior Spa Specialist' },
                        { name: 'Khun Mali', title: 'Master Thai Traditional Practitioner • 14 yrs experience' },
                        { name: 'Khun Somchai', title: 'Deep Tissue & Musculoskeletal Specialist • 10 yrs experience' },
                        { name: 'Khun Siriporn', title: 'Aromatherapy & Holistic Herbal Expert • 9 yrs experience' },
                        { name: 'Khun Anong', title: 'Acupressure & Reflexology Specialist • 8 yrs experience' },
                    ];
                    _a = 0, therapists_1 = therapists;
                    _e.label = 13;
                case 13:
                    if (!(_a < therapists_1.length)) return [3 /*break*/, 16];
                    t = therapists_1[_a];
                    return [4 /*yield*/, prisma.therapist.create({ data: t })];
                case 14:
                    _e.sent();
                    _e.label = 15;
                case 15:
                    _a++;
                    return [3 /*break*/, 13];
                case 16:
                    services = [
                        {
                            name: 'Traditional Thai Massage',
                            description: 'Ancient healing therapy combining rhythmic acupressure, gentle stretching, and energy meridian balancing without oils.',
                            duration: 60,
                            price: 1800,
                            category: 'Thai Massage',
                            imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
                        },
                        {
                            name: 'Traditional Thai Massage (Extended)',
                            description: 'Extended full-body restorative session delivering profound tension release and full muscular decompression.',
                            duration: 90,
                            price: 2500,
                            category: 'Thai Massage',
                            imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80'
                        },
                        {
                            name: 'Royal Thai Herbal Compress Massage',
                            description: 'Heated medicinal herbal compresses infused with lemongrass, plai, turmeric, and camphor pressed along energy lines.',
                            duration: 90,
                            price: 2900,
                            category: 'Thai Massage',
                            imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80'
                        },
                        {
                            name: 'Organic Aroma Oil Massage',
                            description: 'Swedish and Balinese strokes using warm cold-pressed organic botanical oils to soothe the nervous system.',
                            duration: 60,
                            price: 2200,
                            category: 'Oil Massage',
                            imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80'
                        },
                        {
                            name: 'Deep Tissue Herbal Oil Therapy',
                            description: 'Targeted slow-stroke trigger point therapy focusing on chronic muscular knots, shoulder stiffness, and lower back fatigue.',
                            duration: 90,
                            price: 3500,
                            category: 'Oil Massage',
                            imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
                        },
                        {
                            name: 'Volcanic Hot Stone Body Revival',
                            description: 'Polished heated volcanic basalt stones glide seamlessly across tense muscles, melting chronic stiffness.',
                            duration: 90,
                            price: 3800,
                            category: 'Oil Massage',
                            imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80'
                        },
                        {
                            name: 'Signature Baan Bua Imperial Ritual',
                            description: 'The definitive 150-minute sanctuary ritual: organic floral foot bath, lemongrass body scrub, Thai herbal compress, and aroma oil massage.',
                            duration: 150,
                            price: 5500,
                            category: 'Wellness Treatments',
                            imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
                        },
                        {
                            name: "Sacred Sanctuary Couple's Retreat",
                            description: 'A romantic dual session in our VIP couple suite with floral bath, synchronized body massages, and herbal tea celebration.',
                            duration: 90,
                            price: 8200,
                            category: 'Couples',
                            imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80'
                        },
                        {
                            name: "Royal Golden Orchid Couple's Indulgence",
                            description: 'Two hours of bespoke couple pampering: exfoliating jasmine rice scrub, private hydrotherapy soak, and deep restorative oil massage.',
                            duration: 120,
                            price: 9800,
                            category: 'Couples',
                            imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80'
                        },
                        {
                            name: 'Traditional Foot Reflexology & Herbal Soak',
                            description: 'Warm kaffir lime and sea salt foot bath followed by therapeutic pressure point stimulation across vital reflex zones.',
                            duration: 60,
                            price: 1200,
                            category: 'Foot Treatments',
                            imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80'
                        },
                        {
                            name: 'Head, Neck & Shoulder Tension Relief',
                            description: 'Concentrated acupressure therapy designed for computer posture syndrome and stress relief in the cervical spine.',
                            duration: 45,
                            price: 1100,
                            category: 'Body Treatments',
                            imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
                        },
                        {
                            name: 'Serenity Wellness Package',
                            description: '60-min Traditional Thai Massage paired with 60-min Organic Facial or Foot Reflexology with premium herbal tea.',
                            duration: 120,
                            price: 4200,
                            category: 'Spa Packages',
                            imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
                        },
                        {
                            name: 'Bangkok Luxury Rejuvenation Package',
                            description: '3 hours of pure bliss: Tamarind body polish, 90-min Hot Stone Massage, and hydrating organic botanical wrap.',
                            duration: 180,
                            price: 6800,
                            category: 'Spa Packages',
                            imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80'
                        },
                        {
                            name: 'The Imperial Wellness Odyssey',
                            description: 'The pinnacle 4-hour wellness journey: complete head-to-toe hydrotherapy, multi-layer body treatments, and private gourmet dining.',
                            duration: 240,
                            price: 11000,
                            category: 'Spa Packages',
                            imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80'
                        }
                    ];
                    _b = 0, services_1 = services;
                    _e.label = 17;
                case 17:
                    if (!(_b < services_1.length)) return [3 /*break*/, 20];
                    s = services_1[_b];
                    return [4 /*yield*/, prisma.service.create({ data: s })];
                case 18:
                    _e.sent();
                    _e.label = 19;
                case 19:
                    _b++;
                    return [3 /*break*/, 17];
                case 20:
                    nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    offers = [
                        {
                            title: 'FIRST VISIT WELCOME',
                            description: 'Complimentary 20% savings for all first-time guests experiencing Baan Bua Spa.',
                            discount: 20,
                            code: 'FIRST20',
                            minSpend: 1500,
                            firstVisitOnly: true,
                            validUntil: null
                        },
                        {
                            title: "COUPLE'S ESCAPE",
                            description: 'Special 15% discount for any luxury couple spa suite booking.',
                            discount: 15,
                            code: 'COUPLE15',
                            minSpend: 8000,
                            categoryLimit: 'Couples',
                            validUntil: null
                        },
                        {
                            title: 'WEEKDAY WELLNESS',
                            description: 'Flat 25% OFF Monday through Thursday between 11:00 AM and 4:00 PM.',
                            discount: 25,
                            code: 'WEEKDAY25',
                            minSpend: 1800,
                            validUntil: null
                        },
                        {
                            title: 'FESTIVE REJUVENATION',
                            description: 'Seasonal celebratory special: up to 30% OFF luxury wellness packages.',
                            discount: 30,
                            code: 'FESTIVE30',
                            minSpend: 4000,
                            validUntil: nextWeek
                        }
                    ];
                    _c = 0, offers_1 = offers;
                    _e.label = 21;
                case 21:
                    if (!(_c < offers_1.length)) return [3 /*break*/, 24];
                    o = offers_1[_c];
                    return [4 /*yield*/, prisma.offer.create({ data: o })];
                case 22:
                    _e.sent();
                    _e.label = 23;
                case 23:
                    _c++;
                    return [3 /*break*/, 21];
                case 24:
                    reviews = [
                        {
                            customer: 'Lady Penelope H.',
                            rating: 5,
                            treatment: 'Signature Baan Bua Imperial Ritual',
                            comment: 'An oasis of utter tranquility in the heart of Sukhumvit. The therapists have mastered their craft with supreme grace and precision. The herbal tea ritual was divine.'
                        },
                        {
                            customer: 'Tanawat P.',
                            rating: 5,
                            treatment: 'Volcanic Hot Stone Body Revival',
                            comment: 'The finest spa experience in Bangkok. The private suite ambience, aromatic essential oils, and hot stone technique melted all my stress.'
                        },
                        {
                            customer: 'Michael & Sarah C.',
                            rating: 5,
                            treatment: "Royal Golden Orchid Couple's Indulgence",
                            comment: 'We booked the couple sanctuary for our anniversary. Pure luxury from start to finish. The herbal compress and aroma therapy relieved all our travel fatigue.'
                        },
                        {
                            customer: 'Dr. Lisa Chen',
                            rating: 5,
                            treatment: 'Traditional Thai Massage',
                            comment: 'World-class authentic technique. Professional therapists, spotless hygiene standards, and soothing environment. Highly recommended.'
                        }
                    ];
                    _d = 0, reviews_1 = reviews;
                    _e.label = 25;
                case 25:
                    if (!(_d < reviews_1.length)) return [3 /*break*/, 28];
                    r = reviews_1[_d];
                    return [4 /*yield*/, prisma.review.create({ data: r })];
                case 26:
                    _e.sent();
                    _e.label = 27;
                case 27:
                    _d++;
                    return [3 /*break*/, 25];
                case 28: return [4 /*yield*/, prisma.service.findFirst()];
                case 29:
                    firstService = _e.sent();
                    if (!firstService) return [3 /*break*/, 31];
                    return [4 /*yield*/, prisma.appointment.create({
                            data: {
                                bookingCode: 'BB-8921',
                                date: new Date().toISOString().split('T')[0],
                                timeSlot: '02:00 PM',
                                status: 'CONFIRMED',
                                customerName: 'Marcus Vance',
                                customerEmail: 'marcus@example.com',
                                customerPhone: '+66 89 555 1234',
                                guests: 1,
                                therapist: 'Khun Mali',
                                specialRequest: 'Focus on lower back tension please.',
                                serviceId: firstService.id,
                                couponCode: 'FIRST20',
                                discountAmount: firstService.price * 0.2,
                                totalAmount: firstService.price * 0.8,
                                paymentMethod: 'PAY_AT_SPA',
                                paymentStatus: 'PENDING'
                            }
                        })];
                case 30:
                    _e.sent();
                    _e.label = 31;
                case 31:
                    console.log("Seeding Baan Bua Spa completed successfully.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
