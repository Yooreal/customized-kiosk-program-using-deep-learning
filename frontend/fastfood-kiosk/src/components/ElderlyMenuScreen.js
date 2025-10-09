// ElderlyMenuScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ElderlyMenuScreen.css';

const ElderlyMenuScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('new');
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [popupItem, setPopupItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [popupPrice, setPopupPrice] = useState(null);
    const [isEmployeePopupVisible, setIsEmployeePopupVisible] = useState(false);
    const [isBackgroundDimmed, setIsBackgroundDimmed] = useState(false);

    const itemsPerPage = 6;
    const navigate = useNavigate();

    const categories = ['신메뉴', '단품', '세트', '음료', '간식'];

    const categoryMapping = {
        '신메뉴': 'new',
        '단품': 'single',
        '세트': 'set',
        '음료': 'drink',
        '간식': 'side'
    };

    const menuData = {
        new: [
            { name: '통새우 버거', price: 4700, img: '/images/chicken_burger.png', description: '통통한 통새우에<br />새콤달콤 특제소스를 듬뿍 넣은 버거' },
            { name: '화이트갈릭버거', price: 4900, img: '/images/cheese_burger.png', description: '부드러운 마늘 소스에 더블 햄과 통가슴살<br />패티로 조합한 버거' },
            { name: '할라피뇨통살버거', price: 4800, img: '/images/shrimp_jalapeno_burger.png', description: '바삭한 통다리살<br />패티와 청양고추보다 더 매콤한 할라피뇨<br />소스를 조합한 버거' },
        ],
        single: [
            { name: '불고기 버거', price: 3900, img: '/images/bulgogi_burger.png', description: '한국인의 입맛에 딱<br />맞는 불고기 소스에<br />숙성한 패티와 고소한 마요네즈, 신선한<br />양상추를 조합한 버거', best:true },
            { name: '더블 불고기 버거', price: 5200, img: '/images/shrimp_jalapeno_burger.png', description: '진한 불고기 소스에<br />숙성한 패티 두 장과 고소한 치즈와 신선한 양상추를 조합한 버거' },
            { name: '치즈버거', price: 3300, img: '/images/bulgogi_burger.png', description: '고소하고 부드러운<br />치즈와 100%<br />순 쇠고기 패티로<br />구성된 버거' },
            { name: '고급 치즈버거', price: 5400, img: '/images/cheese_burger.png', description: '아메리칸, 파마산,<br />모짜렐라, 체다 치즈의 4가지 고급 치즈와<br />불에 직접 구운 패티를 조합한 버거' },
            { name: '데리버거', price: 3300, img: '/images/bulgogi_burger.png', description: '쇠고기 패티에<br />달콤 짭짤한 간장<br />마늘 소스를 더한<br />가성비 버거' },
            { name: '치킨버거', price: 4000, img: '/images/chicken_burger.png', description: '닭고기 패티와 달콤<br />짭짤한 간장 마늘<br />소스로 만든 담백하고 달콤한 맛의 버거' },
            { name: '핫크리스피 버거', price: 5900, img: '/images/shrimp_jalapeno_burger.png', description: '닭가슴살 패티로 만든 매콤하고 화끈한<br />치킨버거' },
            { name: '토마토치즈\n비프버거', price: 3800, img: '/images/tomato_burger.png', description: '쇠고기 패티에 신선한 토마토와 고소한<br />치즈를 조합한 버거', best:true },
            { name: '통새우 버거', price: 4700, img: '/images/chicken_burger.png', description: '통통한 통새우에<br />새콤달콤 특제소스를 듬뿍 넣은 버거' },
            { name: '화이트갈릭버거', price: 4900, img: '/images/cheese_burger.png', description: '부드러운 마늘 소스에 더블 햄과 통가슴살<br />패티로 조합한 버거' },
            { name: '할라피뇨통살버거', price: 4800, img: '/images/shrimp_jalapeno_burger.png', description: '바삭한 통다리살<br />패티와 청양고추보다 더 매콤한 할라피뇨<br />소스를 조합한 버거' },
        ],
        set: [
            { name: '불고기 버거 세트', price: 6200, img: '/images/burger_set.png', description: '한국인의 입맛에 딱<br />맞는 불고기 소스에<br />숙성한 패티와 고소한 마요네즈, 신선한<br />양상추를 조합한 버거' },
            { name: '더블불고기\n버거세트', price: 7500, img: '/images/burger_set.png', description: '진한 불고기 소스에<br />숙성한 패티 두 장과 고소한 치즈와 신선한 양상추를 조합한 버거' },
            { name: '치즈버거 세트', price: 5500, img: '/images/burger_set.png', description: '고소하고 부드러운<br />치즈와 100% 순<br />쇠고기 패티로<br />구성된 버거' },
            { name: '고급 치즈버거 세트', price: 7700, img: '/images/burger_set.png', description: '아메리칸, 파마산,<br />모짜렐라, 체다 치즈의 4가지 고급 치즈와<br />불에 직접 구운 패티를 조합한 버거' },
            { name: '데리버거 세트', price: 5600, img: '/images/burger_set.png', description: '쇠고기 패티에<br />달콤 짭짤한 간장<br />소스를 더한<br />가성비 버거', best:true },
            { name: '치킨버거 세트', price: 6300, img: '/images/burger_set.png', description: '닭고기 패티와 달콤<br />짭짤한 간장 마늘<br />소스로 만든 담백하고 달콤한 맛의 버거' },
            { name: '핫크리스피\n버거세트', price: 7800, img: '/images/burger_set.png', description: '닭가슴살 패티로 만든 매콤하고 화끈한<br />치킨버거', best:true },
            { name: '토마토치즈비프\n버거 세트', price: 5600, img: '/images/burger_set.png', description: '쇠고기 패티에 신선한 토마토와 고소한<br />치즈를 조합한 버거' },
            { name: '통새우 버거 세트', price: 6900, img: '/images/burger_set.png', description: '통통한 통새우에<br />새콤달콤 특제소스를 듬뿍 넣은 버거' },
            { name: '화이트갈릭버거 세트', price: 7200, img: '/images/burger_set.png', description: '부드러운 마늘 소스에 더블 햄과 통가슴살<br />패티로 조합한 버거' },
            { name: '할라피뇨\n통살버거\n세트', price: 7100, img: '/images/burger_set.png', description: '바삭한 통다리살<br />패티와 청양고추보다 더 매콤한 할라피뇨<br />소스를 조합한 버거' },
        ],

        drink: [
            { name: '코카콜라', price: 2000, img: '/images/coke.png', description: '톡 쏘는 시원함과<br />상쾌함이 느껴지는<br />음료', best:true },
            { name: '사이다', price: 2000, img: '/images/soda.png', description: '톡 쏘는 시원함과<br />상쾌함이 느껴지는<br />음료' },
            { name: '아메리카노', price: 2600, img: '/images/coffee.png', description: '아라비카 원두<br />100%를 함유한<br />부드러운 커피' },
            { name: '오렌지 주스', price: 2500, img: '/images/orange_juice.png', description: '비타민 C를 100%<br />함유한 오렌지 주스' },
            { name: '생수', price: 1000, img: '/images/water.png', description: '활력을 되찾아주는<br />깔끔한 생수' },
        ],
        side: [
            { name: '치킨너겟\n(5조각+소스)', price: 2700, img: '/images/nuggets.png', description: '닭안심살과<br />닭가슴살로 만든<br />담백하고 촉촉한<br />치킨너겟' },
            { name: '감자튀김', price: 2200, img: '/images/frenchfries.png', description: '통으로 썰어낸 감자를 튀겨낸 바삭한<br />감자튀김', best:true },
            { name: '치즈스틱(2조각)', price: 2400, img: '/images/cheese_stick.png', description: '통 모짜렐라 치즈에<br />튀김옷을 입혀 만든<br />바삭하고 고소한<br />치즈스틱'},
            { name: '바닐라 아이스크림콘', price: 1300, img: '/images/ice_cream.png', description: '신선한 우유로 만든<br />부드러운 아이스크림콘', best:true },
            { name: '코울슬로', price: 1900, img: '/images/coleslaw.png', description: '양배추, 당근, 양파가 상큼하고 부드러운<br />마요네즈 드레싱과<br />어우러져 아삭하게<br />씹히는 샐러드' },
            { name: '사이드소스(칠리맛)', price: 500, img: '/images/source.png', description: '치킨너겟, 감자튀김을 더 맛있게 먹고 싶을 때 도움이 되는 소스' },
        ]
    };



    // Voice guidance function with a flag to prevent double playback
    const playVoiceGuidance = (message) => {
        const synth = window.speechSynthesis;
        if (!window.voiceGuidancePlayed) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'ko-KR'; // Adjust language as necessary
            synth.speak(utterance);
            window.voiceGuidancePlayed = true; // Set the flag to true after playing
        }
    };

    useEffect(() => {
        playVoiceGuidance("고령층용 메뉴 화면에 오신 것을 환영합니다. 상단의 신메뉴,단품,세트,음료,디저트를 선택해서 원하는 메뉴를 담고 하단의 결제 버튼을 누르세요. 도움이 필요하면 언제든지 상단의 직원호출 버튼을 눌러주세요.");
    }, []); // Runs once when the component loads

    
    
    const handleCategoryChange = (category) => {
        const mappedCategory = categoryMapping[category]; // Map the displayed name to the data key
        setSelectedCategory(mappedCategory);
        setCurrentPage(0);
    };

    const handleItemClick = (item) => {
        setPopupItem(item);
        setQuantity(1);
        setSelectedOption(null);
        setPopupPrice(item.price); // Initialize price with the default price
    };


    const handleOptionChange = (option) => {
        setSelectedOption(option);

        // Adjust price dynamically for Coca-Cola and Cider
        if (popupItem.name === '코카콜라' || popupItem.name === '사이다') {
            const newPrice = option === 'L' ? 2200 : 2000;
            setPopupPrice(newPrice);
        } else if (option === 'Set') {
            setPopupPrice(popupItem.price + 2000); // Increase by 2000 for Set options
        } else {
            setPopupPrice(popupItem.price); // Default price for other items
        }
    };

    const handleAddToOrder = () => {
        if (!selectedOption && (popupItem.name === '코카콜라' || popupItem.name === '사이다' || popupItem.name === '아메리카노')) {
            alert('옵션을 선택해주세요.');
            return;
        }

        const itemToAdd = { ...popupItem, quantity, option: selectedOption, price: popupPrice };

        

        const existingItemIndex = selectedItems.findIndex(
            (selectedItem) => selectedItem.name === popupItem.name && selectedItem.option === selectedOption
        );

        if (existingItemIndex !== -1) {
            const updatedItems = [...selectedItems];
            updatedItems[existingItemIndex].quantity += quantity;
            setSelectedItems(updatedItems);
        } else {
            setSelectedItems([...selectedItems, itemToAdd]);
        }
        setPopupItem(null);
    };

    const handlePay = () => {
        navigate('/elderly-order-details', { state: { selectedItems } });
    };

    const handleHome = () => {
        navigate('/');
    };

    const handleCallEmployee = () => {
        setIsEmployeePopupVisible(true);
        setIsBackgroundDimmed(true);

        setTimeout(() => {
            setIsEmployeePopupVisible(false);
            setIsBackgroundDimmed(false);
        }, 5000);
    };

    const handleCancelPopup = () => {
        setPopupItem(null);
    };

    const handleCancelAll = () => {
        setSelectedItems([]);
    };


    

    
    

    const currentItems = menuData[selectedCategory].slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="ElderlyMenu-menu-screen">
        {/* Conditionally render the overlay */}
        {isBackgroundDimmed && <div className="ElderlyMenu-menu-overlay"></div>}
            <div className="ElderlyMenu-menu-top-bar">
                <h1 className="ElderlyMenu-menu-store-name">패스트푸드점 키오스크</h1>
                <div>
                    <button className="ElderlyMenu-menu-call-employee-button" onClick={handleCallEmployee}>직원호출</button>
                    <button className="ElderlyMenu-menu-home-button" onClick={handleHome}>홈</button>
                </div>
            </div>
            <div className="ElderlyMenu-menu-category-tabs">
                {Object.keys(categoryMapping).map((category) => (
                    <button
                        key={category}
                        className={`ElderlyMenu-menu-category-tab ${selectedCategory === categoryMapping[category] ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="ElderlyMenu-menu-grid-container">
                <div className="ElderlyMenu-menu-grid">
                    {currentItems.map((item, index) => (
                        <div key={index} className="ElderlyMenu-menu-item" onClick={() => handleItemClick(item)}>
                            <div className="ElderlyMenu-menu-image">
                                <img src={item.img} alt={item.name} />
                                {selectedCategory === 'new' && <span className="ElderlyMenu-menu-new-label">신상</span>}
                                {item.best && <span className="ElderlyMenu-menu-best-label">인기</span>}
                            </div>
                            <div className="ElderlyMenu-menu-name">
                                {item.name}
                            </div>
                            <div className="ElderlyMenu-menu-price">₩{item.price.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="ElderlyMenu-menu-pagination-controls">
                <button className="ElderlyMenu-menu-previous-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>이전</button>
                <button className="ElderlyMenu-menu-next-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={(currentPage + 1) * itemsPerPage >= menuData[selectedCategory].length}>다음</button>
            </div>

            <div className="ElderlyMenu-menu-order-history">
                <h2>주문 내역</h2>
            </div>

            <div className="ElderlyMenu-menu-order-summary">
                <div className="ElderlyMenu-menu-order-summary-header">
                    <span>제품명</span>
                    <span>수량</span>
                    <span>금액</span>
                </div>
                <div className="ElderlyMenu-menu-order-items">
                    {selectedItems.length > 0 ? (
                        selectedItems.map((item, index) => (
                            <div key={index} className="ElderlyMenu-menu-order-item">
                                <span>{item.name} {item.option && `(${item.option})`}</span>
                                <span>{item.quantity}</span>
                                <span>₩{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))
                    ) : (
                        <div className="ElderlyMenu-menu-order-item empty-space">원하시는 메뉴를 담아주세요.</div>
                    )}
                </div>
            </div>

            <div className="ElderlyMenu-menu-order-controls">
                <button className="ElderlyMenu-menu-cancel-all-button" onClick={handleCancelAll}>전체취소</button>
                <button className="ElderlyMenu-menu-pay-button" onClick={handlePay}>결제</button>
            </div>

            {popupItem && (
                <div className="ElderlyMenu-menu-popup">
                    <div className="ElderlyMenu-menu-popup-content">
                        <div className="ElderlyMenu-menu-popup-header">
                            <h2>메뉴 선택</h2>
                            <button className="ElderlyMenu-menu-close-popup" onClick={handleCancelPopup}>×</button>
                        </div>
                        <div className="ElderlyMenu-menu-popup-body">
    <div className="ElderlyMenu-menu-popup-image">
        <img src={popupItem.img} alt={popupItem.name} />
    </div>
    <div className="ElderlyMenu-menu-popup-details">
    <h3 dangerouslySetInnerHTML={{ __html: popupItem.name.replace(/\n/g, '<br />') }}></h3>
    {/* Use dangerouslySetInnerHTML to interpret <br /> */}
    <p dangerouslySetInnerHTML={{ __html: popupItem.description}}></p>

    {popupItem.name === '코카콜라' || popupItem.name === '사이다' ? (
        <div className="ElderlyMenu-menu-option-selection">
            <button onClick={() => handleOptionChange('M')} className={`ElderlyMenu-menu-option-button ${selectedOption === 'M' ? 'active' : ''}`}>중(₩2000)</button>
            <button onClick={() => handleOptionChange('L')} className={`ElderlyMenu-menu-option-button ${selectedOption === 'L' ? 'active' : ''}`}>대(₩2200)</button>
        </div>
    ) : popupItem.name === '아메리카노' ? (
        <div className="ElderlyMenu-menu-option-selection">
            <button onClick={() => handleOptionChange('HOT')} className={`ElderlyMenu-menu-option-button ${selectedOption === 'HOT' ? 'active' : ''}`}>뜨겁게(₩2600)</button>
            <button onClick={() => handleOptionChange('ICE')} className={`ElderlyMenu-menu-option-button ${selectedOption === 'ICE' ? 'active' : ''}`}>차갑게(₩2600)</button>
        
        </div>
    ) : null}

        <p className="ElderlyMenu-menu-popup-price">₩{popupPrice.toLocaleString()}</p>
        <div className="ElderlyMenu-menu-quantity-selection">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
    </div>
</div>

                        <div className="ElderlyMenu-menu-popup-footer">
                            <button className="ElderlyMenu-menu-cancel-button" onClick={handleCancelPopup}>취소</button>
                            <button className="ElderlyMenu-menu-add-button" onClick={handleAddToOrder}>담기</button>
                        </div>
                    </div>
                </div>
            )}
            {isEmployeePopupVisible && (
                <div className="ElderlyMenu-menu-employee-popup">
                    <div className="ElderlyMenu-menu-employee-popup-content">
                        <p className="ElderlyMenu-menu-employee-popup-message">직원을 호출했습니다! 잠시만 기다려주세요.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElderlyMenuScreen;