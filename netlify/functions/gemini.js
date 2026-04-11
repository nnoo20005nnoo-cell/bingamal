exports.handler = async (event) => {
    // التأكد أن الطلب POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY; 

        if (!API_KEY) {
            return { 
                statusCode: 500, 
                body: JSON.stringify({ text: "<li>يا غالي المفتاح مش موجود في الإعدادات</li>" }) 
            };
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        // هنا نستخدم fetch المدمجة (بدون require)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: "أنت خبير مبيعات في محل 'بن جمال عدن' للجوالات. جاوب بلهجة عدنية محببة وراقية. التنسيق HTML بسيط بداخل وسوم <li>: " + prompt 
                    }] 
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
            const aiText = data.candidates[0].content.parts[0].text;
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: aiText })
            };
        } else {
            return { statusCode: 500, body: JSON.stringify({ text: "<li>لم ينجح استخراج الرد من جوجل</li>" }) };
        }

    } catch (error) {
        console.error("Error:", error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ text: "<li>يا غالي في مشكلة تقنية بالمطبخ.. تأكد من الكود</li>" }) 
        };
    }
};