const fetch = require('node-fetch');

exports.handler = async (event) => {
    // السماح بالطلبات فقط من نوع POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        
        // سحب المفتاح من "الخزنة" التي أعددناها في نيتليفاى
        const API_KEY = process.env.GEMINI_API_KEY; 

        if (!API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ text: "خطأ: مفتاح الـ API غير موجود في إعدادات نيتليفاى." })
            };
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: "أنت خبير مبيعات في محل 'بن جمال عدن' للجوالات. جاوب بلهجة عدنية محببة، راقية، ومختصرة. استخدم عبارات مثل (حياك يا غالي، تفضل، من عيوني). التنسيق يجب أن يكون HTML بسيط بداخل وسوم <li>: " + prompt 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const text = data.candidates[0].content.parts[0].text;
            return {
                statusCode: 200,
                body: JSON.stringify({ text: text })
            };
        } else {
            throw new Error("Invalid response from Gemini");
        }

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ text: "<li>يا غالي، في مشكلة تقنية بسيطة بالاتصال.. جرب مرة ثانية</li>" })
        };
    }
};