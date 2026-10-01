const prisma = require('../config/prisma');
const { handle200 } = require('../helper/successHandler');
const { handle500 } = require('../helper/errorHandler');

const defaultAffairs = [
  {
    id: 1,
    title: "ISRO ची नवीन गगनयान चाचणी",
    topic: "MPSC Science",
    shortDesc: "ISRO ने गगनयान मोहिमे अंतर्गत क्रू एस्केप सिस्टीमची (CES) यशस्वी उड्डाण चाचणी पूर्ण केली आहे.",
    longDesc: "ISRO ने नुकतीच गगनयान मोहिमेअंतर्गत 'क्रू एस्केप सिस्टीम' (Crew Escape System) ची पहिली यशस्वी टीव्ही-डी१ (TV-D1) उड्डाण चाचणी पूर्ण केली. याचा मुख्य उद्देश अंतराळवीरांना धोक्याच्या वेळी सुखरूप पृथ्वीवर परत आणणाऱ्या यंत्रणेचे परीक्षण करणे हा होता.",
    points: [
      "चाचणीसाठी वापरलेले रॉकेट: Single-stage liquid rocket",
      "उड्डाण स्थळ: सतीश धवन अंतराळ केंद्र, श्रीहरिकोटा",
      "बंगालच्या उपसागरात लँडिंग यशस्वी."
    ]
  },
  {
    id: 2,
    title: "महाराष्ट्रातील नवीन व्याघ्रप्रकल्प",
    topic: "MPSC Geography",
    shortDesc: "संवर्धन राखीव क्षेत्रांना मान्यता देण्यात आली असून, नव्याने घोषित झालेल्या क्षेत्रांची माहिती.",
    longDesc: "राज्य वन्यजीव मंडळाच्या नुकत्याच झालेल्या बैठकीत, महाराष्ट्रात नवीन संवर्धन राखीव क्षेत्रांना (Conservation Reserves) मान्यता देण्यात आली आहे. यामुळे राज्यातील जैवविविधता टिकवण्यासाठी महत्त्वाचे पाऊल उचलले गेले आहे.",
    points: [
      "नवीन राखीव क्षेत्रांमुळे कॉरिडॉर सुरक्षित होणार.",
      "मानव-वन्यजीव संघर्ष कमी करण्यासाठी उपाययोजना.",
      "विदर्भातील जंगल पट्ट्यांना सर्वाधिक फायदा."
    ]
  }
];

const getCurrentAffairs = async (req, res) => {
  try {
    const config = await prisma.appConfig.findUnique({ where: { key: 'current_affairs_json' } });
    let affairs = defaultAffairs;
    
    if (config && config.value) {
      try {
        affairs = JSON.parse(config.value);
      } catch (e) {
        console.error("Failed to parse current affairs json", e);
      }
    }
    
    handle200(res, affairs, 'Current affairs fetched successfully');
  } catch (error) {
    handle500(res, error);
  }
};

const updateCurrentAffairs = async (req, res) => {
  try {
    const { affairsArray } = req.body;
    
    if (!affairsArray || !Array.isArray(affairsArray)) {
      return res.status(400).json({ status: false, message: 'Invalid format. Must be an array.' });
    }

    await prisma.appConfig.upsert({
      where: { key: 'current_affairs_json' },
      update: { value: JSON.stringify(affairsArray) },
      create: { key: 'current_affairs_json', value: JSON.stringify(affairsArray) }
    });

    handle200(res, { success: true }, 'Current affairs updated globally!');
  } catch (error) {
    handle500(res, error);
  }
};

module.exports = { getCurrentAffairs, updateCurrentAffairs };
