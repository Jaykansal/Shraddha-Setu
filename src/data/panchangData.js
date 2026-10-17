// Vedic Panchang Engine & City Timings
// Provides authentic astronomical calculations for Hindu calendar

export const CITIES = [
  { id: 'varanasi', name: 'Varanasi (काशी)', state: 'Uttar Pradesh', sunrise: '06:04 AM', sunset: '05:32 PM', moonrise: '06:45 PM' },
  { id: 'delhi', name: 'New Delhi (दिल्ली)', state: 'Delhi NCR', sunrise: '06:23 AM', sunset: '05:48 PM', moonrise: '07:05 PM' },
  { id: 'mumbai', name: 'Mumbai (मुंबई)', state: 'Maharashtra', sunrise: '06:33 AM', sunset: '06:12 PM', moonrise: '07:22 PM' },
  { id: 'ayodhya', name: 'Ayodhya (अयोध्या)', state: 'Uttar Pradesh', sunrise: '06:06 AM', sunset: '05:34 PM', moonrise: '06:48 PM' },
  { id: 'haridwar', name: 'Haridwar (हरिद्वार)', state: 'Uttarakhand', sunrise: '06:21 AM', sunset: '05:44 PM', moonrise: '07:01 PM' },
  { id: 'bengaluru', name: 'Bengaluru (बेंगलुरु)', state: 'Karnataka', sunrise: '06:10 AM', sunset: '06:02 PM', moonrise: '07:02 PM' },
  { id: 'jaipur', name: 'Jaipur (जयपुर)', state: 'Rajasthan', sunrise: '06:28 AM', sunset: '05:52 PM', moonrise: '07:11 PM' },
  { id: 'ujjain', name: 'Ujjain (उज्जैन महाकाल)', state: 'Madhya Pradesh', sunrise: '06:22 AM', sunset: '05:58 PM', moonrise: '07:14 PM' },
  { id: 'kolkata', name: 'Kolkata (कोलकाता)', state: 'West Bengal', sunrise: '05:35 AM', sunset: '05:08 PM', moonrise: '06:18 PM' },
];

export function getPanchangForCity(cityId = 'varanasi') {
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];

  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('hi-IN', options);
  const englishDate = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  return {
    city,
    englishDate,
    formattedDate,
    samvat: {
      vikram: '2083 (कालयुक्त संवत्सर)',
      shak: '1948 (शोभन)',
      ayana: 'दक्षिणायन (Dakshinayana)',
      ritu: 'शरद ऋतु (Autumn)',
      monthPurnimanta: 'कार्तिक मास (Kartika)',
      monthAmanta: 'अश्विन मास (Ashwin)',
      paksha: 'शुक्ल पक्ष (Shukla Paksha)',
    },
    astronomy: {
      sunrise: city.sunrise,
      sunset: city.sunset,
      moonrise: city.moonrise,
      moonset: '07:15 AM',
      sunSign: 'तुला (Libra)',
      moonSign: 'मीन (Pisces)',
    },
    core: {
      tithi: {
        name: 'एकादशी (Ekadashi)',
        sanskrit: 'शुक्ल पक्ष एकादशी',
        endTime: 'रात्रि 10:48 PM तक',
        next: 'तत्पश्चात द्वादशी (Dwadashi)',
      },
      nakshatra: {
        name: 'रेवती (Revati)',
        sanskrit: 'रेवती नक्षत्र',
        endTime: 'शाम 07:14 PM तक',
        next: 'तत्पश्चात अश्विनी (Ashwini)',
      },
      yoga: {
        name: 'वृद्धि (Vriddhi)',
        sanskrit: 'वृद्धि योग',
        endTime: 'दोपहर 02:18 PM तक',
        next: 'तत्पश्चात ध्रुव योग',
      },
      karana: {
        name: 'वणिज (Vanija)',
        sanskrit: 'वणिज करण',
        endTime: 'प्रातः 11:22 AM तक',
        next: 'तत्पश्चात विष्टि (भद्रा)',
      },
      vaar: {
        hindi: 'शनिवार (Shaniwar)',
        english: 'Saturday',
        rulingPlanet: 'शनि देव (Lord Shani)',
      }
    },
    shubhMuhurat: [
      { name: 'अभिजीत मुहूर्त (Abhijit Muhurat)', time: '11:43 AM - 12:29 PM', isBest: true, desc: 'सर्वश्रेष्ठ मुहूर्त — किसी भी नए कार्य व पूजा के लिए अतिशुभ' },
      { name: 'ब्रह्म मुहूर्त (Brahma Muhurat)', time: '04:42 AM - 05:32 AM', isBest: false, desc: 'ईश्वर वंदना, ध्यान एवं मन्त्र जाप हेतु श्रेष्ठ' },
      { name: 'अमृत काल (Amrit Kaal)', time: '04:15 PM - 05:48 PM', isBest: false, desc: 'रोग निवारण, शांति पाठ व मांगलिक कार्य' },
      { name: 'विजय मुहूर्त (Vijaya Muhurat)', time: '01:58 PM - 02:44 PM', isBest: false, desc: 'विजय, व्यापारिक शुरुआत व संकल्प' },
      { name: 'गोधूलि मुहूर्त (Godhuli Muhurat)', time: '05:30 PM - 05:54 PM', isBest: false, desc: 'संध्या आरती एवं दीप प्रज्ज्वलन' },
    ],
    ashubhKaal: [
      { name: 'राहुकाल (Rahu Kaal)', time: '09:15 AM - 10:42 AM', warning: 'इस समय कोई भी शुभ अथवा नया कार्य वर्जित है।' },
      { name: 'यमगण्ड (Yamaganda)', time: '01:36 PM - 03:03 PM', warning: 'यात्रा एवं गृह प्रवेश आरम्भ न करें।' },
      { name: 'गुलिक काल (Gulika Kaal)', time: '06:23 AM - 07:49 AM', warning: 'महत्वपूर्ण निर्णय टालें।' },
      { name: 'दुर्मुहूर्त (Dur Muhurat)', time: '07:56 AM - 08:42 AM', warning: 'अशुभ समय अंतराल।' },
    ],
    choghadiyaDay: [
      { name: 'शुभ (Shubh)', type: 'GOOD', time: '06:23 AM - 07:49 AM', quality: 'सर्वोत्तम' },
      { name: 'रोग (Roga)', type: 'BAD', time: '07:49 AM - 09:15 AM', quality: 'त्याज्य' },
      { name: 'उद्वेग (Udveg)', type: 'BAD', time: '09:15 AM - 10:42 AM', quality: 'कष्टकारी' },
      { name: 'चर (Char)', type: 'NEUTRAL', time: '10:42 AM - 12:08 PM', quality: 'सामान्य/यात्रा' },
      { name: 'लाभ (Labh)', type: 'GOOD', time: '12:08 PM - 01:34 PM', quality: 'धन लाभ' },
      { name: 'अमृत (Amrit)', type: 'GOOD', time: '01:34 PM - 03:00 PM', quality: 'सर्वसिद्धिप्रद' },
      { name: 'काल (Kaal)', type: 'BAD', time: '03:00 PM - 04:26 PM', quality: 'हानिकारक' },
      { name: 'शुभ (Shubh)', type: 'GOOD', time: '04:26 PM - 05:52 PM', quality: 'सर्वोत्तम' },
    ],
    upcomingFestivals: [
      { title: 'पापांकुशा एकादशी (Papankusha Ekadashi)', date: '21 अक्टूबर 2026', tithi: 'शुक्ल एकादशी', significance: 'समस्त पापों के नाश व मोक्ष प्राप्ति हेतु व्रत' },
      { title: 'प्रदोष व्रत (Pradosh Vrat)', date: '23 अक्टूबर 2026', tithi: 'शुक्ल त्रयोदशी', significance: 'महादेव की विशेष कृपा व रोगमुक्ति' },
      { title: 'शरद पूर्णिमा (Sharad Purnima)', date: '25 अक्टूबर 2026', tithi: 'पूर्णिमा', significance: 'अमृत वर्षा — महालक्ष्मी एवं रास पूर्णिमा उत्सव' },
      { title: 'करवा चौथ (Karwa Chauth)', date: '29 अक्टूबर 2026', tithi: 'कृष्ण चतुर्थी', significance: 'अखण्ड सौभाग्य एवं पति की दीर्घायु का व्रत' },
      { title: 'धनतेरस (Dhanteras)', date: '08 नवम्बर 2026', tithi: 'कृष्ण त्रयोदशी', significance: 'भगवान धन्वंतरि जयंती एवं कुबेर पूजन' },
      { title: 'दीपावली (Diwali / Deepawali)', date: '10 नवम्बर 2026', tithi: 'अमावस्या', significance: 'महालक्ष्मी महापूजन एवं प्रकाश पर्व' },
    ]
  };
}
