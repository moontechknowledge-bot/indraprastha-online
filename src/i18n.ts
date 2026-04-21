import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "search_placeholder": "Search for Shops, Services, Products...",
      "list_your_shop": "List Your Shop",
      "login": "Login",
      "dashboard": "Dashboard",
      "admin_panel": "Admin Panel",
      "logout": "Logout",
      "tagline": "Bharat Ka Local Bazaar",
      "select_city": "Select City",
      "about_us": "About Us",
      "contact_us": "Contact Us",
      "privacy_policy": "Privacy Policy",
      "terms_conditions": "Terms & Conditions",
      "refund_policy": "Refund Policy",
      "quick_links": "Quick Links",
      "top_categories": "Top Categories",
      "footer_desc": "Bharat Ka Local Bazaar. Connecting local buyers with trusted local businesses across India. Direct orders, zero commission.",
      "all_rights_reserved": "All Rights Reserved. Designed with ❤️ for Bharat.",
      "about_page": {
        "title": "About IndraprasthaOnline",
        "p1": "IndraprasthaOnline is Bharat’s local digital marketplace designed to connect local businesses with nearby customers. Our mission is to empower small shopkeepers, service providers, and manufacturers by giving them a simple platform to showcase their offerings and receive direct orders via call and WhatsApp.",
        "p2": "We believe in zero commission, direct communication, and local economic growth. Every business listed on our platform represents trust, accessibility, and real connections within the community.",
        "p3": "Our vision is to make every local business digitally visible and easily reachable."
      },
      "contact_page": {
        "title": "Contact Us",
        "subtitle": "We are here to support you.",
        "head_office": "Head Office: Pan India",
        "phone": "Phone: +91 8505897985",
        "email": "Email: info@indraprasthaonline.co.in",
        "note": "For business onboarding, partnerships, or support, feel free to reach out via call or email."
      },
      "privacy_page": {
        "title": "Privacy Policy",
        "p1": "We respect your privacy. IndraprasthaOnline collects only essential information such as name, phone number, and business details to provide services.",
        "p2": "We do not sell or share your personal data with third parties. All data is securely stored and used only for platform functionality.",
        "p3": "By using our platform, you agree to our data practices."
      },
      "terms_page": {
        "title": "Terms & Conditions",
        "p1": "By using IndraprasthaOnline, you agree to provide accurate business information. The platform acts as a directory and does not take responsibility for transactions between buyers and sellers.",
        "p2": "We reserve the right to approve, reject, or remove listings that violate our policies."
      },
      "refund_page": {
        "title": "Refund Policy",
        "p1": "All payments made for PRIME listing are non-refundable. Once a business is upgraded and verified, the service is considered delivered."
      },
      "hero": {
        "slide1": {
          "title": "Gau Seva Param Dharma",
          "subtitle": "We will always donate 10% of our profits to Gau Seva.",
          "cta": "Support Now"
        },
        "slide2": {
          "title": "Bharat ka Local Bazar",
          "subtitle": "Not just business, build a new identity. Our goal is to make it easy for every shopkeeper brother to come online.",
          "cta": "Start Your Digital Shop"
        },
        "slide3": {
          "title": "Indraprastha Online – Bharat ka Local Bazar!",
          "subtitle": "Contact now to register your business",
          "cta": "Register Now"
        },
        "slide4": {
          "title": "Founding Member Offer",
          "subtitle": "Exclusive 1st Year Deal for Local Businesses",
          "cta": "Grab Offer Now"
        },
        "slide5": {
          "title": "Latest Fashion Trends",
          "subtitle": "Discover the best local fashion boutiques and designers in your city.",
          "cta": "Explore Fashion"
        },
        "slide6": {
          "title": "Smart Electronics",
          "subtitle": "Find the latest gadgets and reliable repair services near you.",
          "cta": "Shop Electronics"
        },
        "slide7": {
          "title": "Quality Education",
          "subtitle": "Connect with top tutors, coaching centers, and schools in your area.",
          "cta": "Find Tutors"
        },
        "slide8": {
          "title": "Dream Real Estate",
          "subtitle": "Buy, sell, or rent properties with trusted local agents and developers.",
          "cta": "View Properties"
        }
      },
      "home": {
        "recommended": "Recommended",
        "businesses": "Businesses",
        "top_rated_in": "Top rated services in",
        "open_now": "Open Now",
        "top_rated": "Top Rated",
        "more": "More",
        "no_biz_found": "No businesses found",
        "try_changing": "Try changing your location or category"
      },
      "footer": {
        "grow_business": "Grow Your Business Online",
        "join_indraprastha": "Join Indraprastha Online and reach thousands of customers in your city. List your shop today and start growing.",
        "list_your_business": "List Your Business",
        "made_in_bharat": "Made in Bharat",
        "powered_by": "Powered By MoonTechKnowledge"
      }
    }
  },
  hi: {
    translation: {
      "search_placeholder": "दुकानें, सेवाएं, उत्पाद खोजें...",
      "list_your_shop": "अपनी दुकान लगायें",
      "login": "लॉगिन",
      "dashboard": "डैशबोर्ड",
      "admin_panel": "एडमिन पैनल",
      "logout": "लॉगआउट",
      "tagline": "भारत का लोकल बाज़ार",
      "select_city": "शहर चुनें",
      "about_us": "हमारे बारे में",
      "contact_us": "संपर्क करें",
      "privacy_policy": "गोपनीयता नीति",
      "terms_conditions": "नियम और शर्तें",
      "refund_policy": "धनवापसी नीति",
      "quick_links": "त्वरित लिंक",
      "top_categories": "शीर्ष श्रेणियां",
      "footer_desc": "भारत का लोकल बाज़ार। पूरे भारत में स्थानीय खरीदारों को विश्वसनीय स्थानीय व्यवसायों से जोड़ना। सीधे ऑर्डर, शून्य कमीशन।",
      "all_rights_reserved": "सर्वाधिकार सुरक्षित। भारत के लिए ❤️ के साथ डिज़ाइन किया गया।",
      "about_page": {
        "title": "इंद्रप्रस्थऑनलाइन के बारे में",
        "p1": "इंद्रप्रस्थऑनलाइन भारत का स्थानीय डिजिटल बाज़ार है जिसे स्थानीय व्यवसायों को आस-पास के ग्राहकों से जोड़ने के लिए डिज़ाइन किया गया है। हमारा मिशन छोटे दुकानदारों, सेवा प्रदाताओं और निर्माताओं को अपनी पेशकश दिखाने और कॉल और व्हाट्सएप के माध्यम से सीधे ऑर्डर प्राप्त करने के लिए एक सरल मंच देकर सशक्त बनाना है।",
        "p2": "हम शून्य कमीशन, सीधे संचार और स्थानीय आर्थिक विकास में विश्वास करते हैं। हमारे मंच पर सूचीबद्ध प्रत्येक व्यवसाय समुदाय के भीतर विश्वास, सुलभता और वास्तविक संबंधों का प्रतिनिधित्व करता है।",
        "p3": "हमारा विजन हर स्थानीय व्यवसाय को डिजिटल रूप से दृश्यमान और आसानी से सुलभ बनाना है।"
      },
      "contact_page": {
        "title": "संपर्क करें",
        "subtitle": "हम आपकी सहायता के लिए यहाँ हैं।",
        "head_office": "मुख्य कार्यालय: पैन इंडिया",
        "phone": "फोन: +91 8505897985",
        "email": "ईमेल: info@indraprasthaonline.co.in",
        "note": "बिजनेस ऑनबोर्डिंग, साझेदारी या सहायता के लिए, बेझिझक कॉल या ईमेल के माध्यम से संपर्क करें।"
      },
      "privacy_page": {
        "title": "गोपनीयता नीति",
        "p1": "हम आपकी गोपनीयता का सम्मान करते हैं। इंद्रप्रस्थऑनलाइन सेवाएं प्रदान करने के लिए केवल नाम, फोन नंबर और व्यावसायिक विवरण जैसी आवश्यक जानकारी एकत्र करता है।",
        "p2": "हम आपका व्यक्तिगत डेटा तीसरे पक्ष को नहीं बेचते या साझा नहीं करते हैं। सभी डेटा सुरक्षित रूप से संग्रहीत हैं और केवल प्लेटफ़ॉर्म कार्यक्षमल के लिए उपयोग किए जाते हैं।",
        "p3": "हमारे प्लेटफ़ॉर्म का उपयोग करके, आप हमारी डेटा प्रथाओं से सहमत होते हैं।"
      },
      "terms_page": {
        "title": "नियम और शर्तें",
        "p1": "इंद्रप्रस्थऑनलाइन का उपयोग करके, आप सटीक व्यावसायिक जानकारी प्रदान करने के लिए सहमत होते हैं। प्लेटफ़ॉर्म एक निर्देशिका के रूप में कार्य करता है और खरीदारों और विक्रेताओं के बीच लेनदेन के लिए ज़िम्मेदारी नहीं लेता है।",
        "p2": "हम उन लिस्टिंग को स्वीकृत, अस्वीकार या हटाने का अधिकार सुरक्षित रखते हैं जो हमारी नीतियों का उल्लंघन करती हैं।"
      },
      "refund_page": {
        "title": "धनवापसी नीति",
        "p1": "प्राइम लिस्टिंग के लिए किए गए सभी भुगतान गैर-वापसी योग्य हैं। एक बार व्यवसाय अपग्रेड और सत्यापित हो जाने के बाद, सेवा को वितरित माना जाता है।"
      },
      "hero": {
        "slide1": {
          "title": "गौसेवा परम धर्म",
          "subtitle": "हम अपने मुनाफे का 10% हमेशा गौसेवा के लिए दान करेंगे।",
          "cta": "सहयोग करें"
        },
        "slide2": {
          "title": "भारत का लोकल बाजार",
          "subtitle": "सिर्फ व्यापार नहीं, एक नई पहचान बनाएं। हमारा उद्देश्य हर दुकानदार भाई का ऑनलाइन आना आसान बनाना है।",
          "cta": "अपनी डिजिटल दुकान शुरू करें"
        },
        "slide3": {
          "title": "इंद्रप्रस्थ ऑनलाइन – भारत का लोकल बाजार!",
          "subtitle": "अपना बिजनेस रजिस्टर करने के लिए अभी संपर्क करें",
          "cta": "अभी रजिस्टर करें"
        },
        "slide4": {
          "title": "फाउंडिंग मेंबर ऑफर",
          "subtitle": "स्थानीय व्यवसायों के लिए विशेष प्रथम वर्ष का सौदा",
          "cta": "ऑफर का लाभ उठाएं"
        },
        "slide5": {
          "title": "नवीनतम फैशन ट्रेंड",
          "subtitle": "अपने शहर में सर्वश्रेष्ठ स्थानीय फैशन बुटीक और डिजाइनरों की खोज करें।",
          "cta": "फैशन एक्सप्लोर करें"
        },
        "slide6": {
          "title": "स्मार्ट इलेक्ट्रॉनिक्स",
          "subtitle": "अपने पास नवीनतम गैजेट और विश्वसनीय मरम्मत सेवाएं खोजें।",
          "cta": "इलेक्ट्रॉनिक्स खरीदें"
        },
        "slide7": {
          "title": "गुणवत्तापूर्ण शिक्षा",
          "subtitle": "अपने क्षेत्र के शीर्ष ट्यूटर्स, कोचिंग सेंटरों और स्कूलों से जुड़ें।",
          "cta": "ट्यूटर खोजें"
        },
        "slide8": {
          "title": "सपनों का रियल एस्टेट",
          "subtitle": "विश्वसनीय स्थानीय एजेंटों और डेवलपर्स के साथ संपत्ति खरीदें, बेचें या किराए पर लें।",
          "cta": "प्रॉपर्टी देखें"
        }
      },
      "home": {
        "recommended": "अनुशंसित",
        "businesses": "व्यवसाय",
        "top_rated_in": "शीर्ष रेटेड सेवाएं",
        "open_now": "अभी खुला है",
        "top_rated": "टॉप रेटेड",
        "more": "अधिक",
        "no_biz_found": "कोई व्यवसाय नहीं मिला",
        "try_changing": "अपना स्थान या श्रेणी बदलने का प्रयास करें"
      },
      "footer": {
        "grow_business": "अपना व्यवसाय ऑनलाइन बढ़ाएं",
        "join_indraprastha": "इंद्रप्रस्थ ऑनलाइन से जुड़ें और अपने शहर के हजारों ग्राहकों तक पहुंचें। आज ही अपनी दुकान सूचीबद्ध करें और बढ़ना शुरू करें।",
        "list_your_business": "अपना व्यवसाय सूचीबद्ध करें",
        "made_in_bharat": "भारत में निर्मित",
        "powered_by": "मूनटेकनॉलेज द्वारा संचालित"
      }
    }
  },
  bn: { translation: { "tagline": "ভারতের লোকাল বাজার", "search_placeholder": "দোকান, পরিষেবা খুঁজুন..." } },
  mr: { translation: { "tagline": "भारताचा लोकल बाजार", "search_placeholder": "दुकाने, सेवा शोधा..." } },
  te: { translation: { "tagline": "భారత్ కా లోకల్ బజార్", "search_placeholder": "దుకాణాలు, సేవలను వెతకండి..." } },
  ta: { translation: { "tagline": "பாரதத்தின் உள்ளூர் சந்தை", "search_placeholder": "கடைகள், சேவைகளைத் தேடுங்கள்..." } },
  gu: { translation: { "tagline": "ભારતનું લોકલ બજાર", "search_placeholder": "દુકાનો, સેવાઓ શોધો..." } },
  kn: { translation: { "tagline": "ಭಾರತದ ಲೋಕಲ್ ಬಜಾರ್", "search_placeholder": "ಅಂಗಡಿಗಳು, ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ..." } },
  ml: { translation: { "tagline": "ഭാരതത്തിന്റെ ലോക്കൽ ബസാർ", "search_placeholder": "കടകൾ, സേവനങ്ങൾ തിരയുക..." } },
  pa: { translation: { "tagline": "ਭਾਰਤ ਦਾ ਲੋਕਲ ਬਾਜ਼ਾਰ", "search_placeholder": "ਦੁਕਾਨਾਂ, ਸੇਵਾਵਾਂ ਲੱਭੋ..." } },
  or: { translation: { "tagline": "ଭାରତର ଲୋକାଲ ବଜାର", "search_placeholder": "ଦୋକାନ, ସେବା ଖୋଜନ୍ତୁ..." } },
  ru: { translation: { "tagline": "Местный рынок Индии", "search_placeholder": "Поиск магазинов, услуг..." } },
  he: { translation: { "tagline": "השוק המקומי של הודו", "search_placeholder": "חפש חנויות, שירותים..." } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
