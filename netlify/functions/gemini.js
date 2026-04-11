exports.handler = async (event) => {
    try {
        const { prompt } = JSON.parse(event.body);
        
        // مفتاحك الجديد هنا - آمن ومخفي عن الناس
        const API_KEY = "AIzaSyA6uTDJ1xAtWPX9YqDszaPASp-ifm5HUcE"; 
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "أنت خبير مبيعات في محل بن جمال عدن. جاوب بلهجة عدنية مهذبة جداً وبصيغة المفرد (تفضل، يا غالي، حياك الله). التنسيق HTML بداخل <li>: " + prompt }] }]
            })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            body: JSON.stringify({ text: text })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ text: "<li>يا غالي، في مشكلة بالاتصال.. جرب مرة ثانية</li>" })
        };
    }
};