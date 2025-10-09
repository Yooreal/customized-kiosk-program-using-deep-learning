// success code :
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GeneralMenuScreen.css';

const GeneralMenuScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState('new');
    const [selectedItems, setSelectedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [popupItem, setPopupItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedOption, setSelectedOption] = useState(null);
    const [popupPrice, setPopupPrice] = useState(null);
    const [isEmployeePopupVisible, setIsEmployeePopupVisible] = useState(false);
    const [isBackgroundDimmed, setIsBackgroundDimmed] = useState(false);
    const [isRecommendationPopupVisible, setIsRecommendationPopupVisible] = useState(false);
    const [recommendedItems, setRecommendedItems] = useState([]); // Store multiple selected items
    

    const itemsPerPage = 11;
    const navigate = useNavigate();

    const categories = ['NEW', 'SINGLE', 'SET', 'DRINK', 'SIDE'];

    const categoryMapping = {
        'NEW': 'new',
        'SINGLE': 'single',
        'SET': 'set',
        'DRINK': 'drink',
        'SIDE': 'side'
    };

    const menuData = {
        new: [
            { name: '슈슈 버거\nSupreme Shrimp Burger', price: 4700, img: '/images/chicken_burger.png', description: '새콤달콤 특제소스를 듬뿍 넣은 탱글한<br />통새우살이 가득한<br />슈슈 버거' },
            { name: '화이트갈릭버거\nWhite Garlic Burger', price: 4900, img: '/images/cheese_burger.png', description: '부드러운 마늘 소스에 프리미엄 더블 햄과<br />통가슴살 패티까지<br />담은 묵직한 버거' },
            { name: '할라피뇨통살버거\nJalapeno Thigh Burger', price: 4800, img: '/images/shrimp_jalapeno_burger.png', description: '바삭한 통다리살<br />패티와 매콤한<br />할라피뇨 소스가<br />어우러져 뒷맛까지<br />깔끔한 버거' },
        ],
        single: [
            { name: '불고기 버거\nBulgogi Burger', price: 3900, img: '/images/bulgogi_burger.png', description: '한국인의 입맛에<br />딱 맞는 불고기 소스에 재운 패티로 구성된<br />불고기 버거', best:true },
            { name: '더블 불고기 버거\nDouble Bulgogi Burger', price: 5200, img: '/images/shrimp_jalapeno_burger.png', description: '진한 불고기 소스에<br />재운 패티 두 장으로 구성된 깊고 풍부한<br />맛의 버거' },
            { name: '치즈버거\nCheese Burger', price: 3300, img: '/images/bulgogi_burger.png', description: '고소하고 부드러운<br />치즈와 100%<br />순 쇠고기 패티로<br />구성된 심플한 클래식 치즈버거' },
            { name: '콰트로 치즈버거\nQuattro Cheese Burger', price: 5400, img: '/images/cheese_burger.png', description: '아메리칸, 파마산,<br />모짜렐라, 체다 치즈의 4가지 고급 치즈와<br />풍부한 육즙의 패티를 더 진하게 즐길 수<br />있는 버거' },
            { name: '데리버거\nTeri Burger', price: 3300, img: '/images/bulgogi_burger.png', description: '쇠고기 패티에 달콤<br />짭짤한 데리 소스를<br />더한 가성비 버거' },
            { name: '치킨버거\nChicken Burger', price: 4000, img: '/images/chicken_burger.png', description: '닭고기 패티와<br />데리야끼 소스로 만든 담백하고 달콤한 맛의 치킨버거' },
            { name: '핫크리스피 디럭스 버거\nHotCrispy Deluxe Burger', price: 5900, img: '/images/shrimp_jalapeno_burger.png', description: '100% 통닭다리살<br />겉바속촉 케이준 치킨 패티, 촉촉한 포테이토 브리오쉬 번, 스페셜 스모키 소스가<br />선사하는 놀랍도록<br />새로운 맛의 치킨 버거' },
            { name: '토마토치즈 비프버거\nTomato Cheese Beef Burger', price: 3800, img: '/images/tomato_burger.png', description: '신선한 토마토와 매콤달콤한 소스, 고소한 치즈를 더해 더욱<br />풍부하고 신선한<br />맛의 버거', best:true },
            { name: '슈슈 버거\nSupreme Shrimp Burger', price: 4700, img: '/images/chicken_burger.png', description: '새콤달콤 특제소스를 듬뿍 넣은 탱글한<br />통새우살이 가득한<br />슈슈 버거' },
            { name: '화이트갈릭버거\nWhite Garlic Burger', price: 4900, img: '/images/cheese_burger.png', description: '부드러운 마늘 소스에 프리미엄 더블 햄과<br />통가슴살 패티까지<br />담은 묵직한 버거' },
            { name: '할라피뇨통살버거\nJalapeno Thigh Burger', price: 4800, img: '/images/shrimp_jalapeno_burger.png', description: '바삭한 통다리살<br />패티와 매콤한<br />할라피뇨 소스가<br />어우러져 뒷맛까지<br />깔끔한 버거' },
        ],
        set: [
            { name: '불고기 버거 세트\nBulgogi Burger Set', price: 6200, img: '/images/burger_set.png', description: '한국인의 입맛에<br />딱 맞는 불고기 소스에 재운 패티로 구성된<br />불고기 버거 세트' },
            { name: '더블불고기\n버거세트\nDouble Bulgogi Burger Set', price: 7500, img: '/images/burger_set.png', description: '진한 불고기 소스에<br />재운 패티 두 장으로 구성된 깊고 풍부한<br />맛의 버거 세트' },
            { name: '치즈버거 세트\nCheese Burger Set', price: 5500, img: '/images/burger_set.png', description: '고소하고 부드러운<br />치즈와 100% 순<br />쇠고기 패티로 구성된 심플한 클래식<br />치즈버거 세트' },
            { name: '콰트로 치즈버거  세트\nQuattro Cheese Burger Set', price: 7700, img: '/images/burger_set.png', description: '아메리칸, 파마산,<br />모짜렐라, 체다 치즈의 4가지 고급 치즈와<br />풍부한 육즙의 패티를 더 진하게 즐길 수<br />있는 버거 세트' },
            { name: '데리버거 세트\nTeri Burger Set', price: 5600, img: '/images/burger_set.png', description: '쇠고기 패티에 달콤<br />짭짤한 데리소스를<br />더한 가성비 버거 세트', best:true },
            { name: '치킨버거 세트\nChicken Burger Set', price: 6300, img: '/images/burger_set.png', description: '닭고기 패티와<br />데리야끼 소스로 만든 담백하고 달콤한 맛의 치킨버거 세트' },
            { name: '핫크리스피\n디럭스 버거세트\nHotCrispy Deluxe Burger Set', price: 7800, img: '/images/burger_set.png', description: '100% 통닭다리살<br />겉바속촉 케이준 치킨 패티, 촉촉한 포테이토 브리오쉬 번, 스페셜 스모키 소스가<br />선사하는 놀랍도록<br />새로운 맛의 치킨<br />버거 세트', best:true },
            { name: '토마토치즈비프\n버거 세트\nTomato Cheese Beef Burger Set', price: 5600, img: '/images/burger_set.png', description: '신선한 토마토와 매콤달콤한 소스, 고소한 치즈를 더해 더욱<br />풍부하고 신선한 맛의 버거 세트' },
            { name: '슈슈 버거 세트\nSupreme Shrimp Burger Set', price: 6900, img: '/images/burger_set.png', description: '새콤달콤 특제소스를 듬뿍 넣은 탱글한<br />통새우살이 가득한<br />슈슈 버거 세트' },
            { name: '화이트갈릭버거 세트\nWhite Garlic Burger Set', price: 7200, img: '/images/burger_set.png', description: '부드러운 마늘 소스에 프리미엄 더블 햄과<br />통가슴살 패티까지<br />담은 묵직한 버거 세트' },
            { name: '할라피뇨\n통살버거\n세트\nJalapeno Thigh Burger Set', price: 7100, img: '/images/burger_set.png', description: '바삭한 통다리살<br />패티와 매콤한<br />할라피뇨 소스가<br />어우러져 뒷맛까지<br />깔끔한 버거 세트' },
        ],

        drink: [
            { name: '코카콜라\nCola', price: 2000, img: '/images/coke.png', description: '톡 쏘는 시원함과<br />상쾌함이 느껴지는<br />음료', best:true },
            { name: '사이다\nSprite', price: 2000, img: '/images/soda.png', description: '톡 쏘는 시원함과<br />상쾌함이 느껴지는<br />음료' },
            { name: '아메리카노\nAmericano', price: 2600, img: '/images/coffee.png', description: '아라비카 원두<br />100%를 함유한<br />부드러운 커피' },
            { name: '오렌지 주스\nOrange Juice', price: 2500, img: '/images/orange_juice.png', description: '비타민 C를 100%<br />함유한 오렌지 주스' },
            { name: '생수\nWater', price: 1000, img: '/images/water.png', description: '활력을 되찾아주는<br />깔끔한 생수' },
        ],
        side: [
            { name: '치킨너겟\nChicken Nugget', price: 2700, img: '/images/nuggets.png', description: '닭안심살과 닭가슴살로 만든 담백하고<br />촉촉한 치킨너겟<br />구성 : 5조각+소스' },
            { name: '후렌치 후라이\nFrench Fries', price: 2200, img: '/images/frenchfries.png', description: '통으로 썰어낸 감자를 튀겨낸 바삭한<br />감자튀김', best:true },
            { name: '골든 모짜렐라 치즈스틱\nGolden Mozzarella Cheese Sticks', price: 2400, img: '/images/cheese_stick.png', description: '통 모짜렐라 치즈에<br />튀김옷을 입혀 만든<br />바삭하고 고소한<br />치즈스틱<br />구성 : 2조각'},
            { name: '바닐라 아이스크림콘\nVanilla Ice Cream Cone', price: 1300, img: '/images/ice_cream.png', description: '신선한 우유로 만든<br />부드러운 아이스크림콘', best:true },
            { name: '코울슬로\nColeslaw', price: 1900, img: '/images/coleslaw.png', description: '양배추, 당근, 양파가 상큼하고 부드러운<br />마요네즈 드레싱과<br />어우러져 아삭하게<br />씹히는 샐러드' },
            { name: '사이드소스\nSauce', price: 500, img: '/images/source.png', description: '치킨너겟, 감자튀김을 더 맛있게 먹고 싶을 때 도움이 되는 소스<br />구성 : 칠리맛' },
        ]
    };


    const recommendedMenus = [
        { name: '골든 모짜렐라\n치즈스틱', price: 2400, img: '/images/cheese_stick.png' },
        { name: '바닐라\n아이스크림콘', price: 1300, img: '/images/ice_cream.png' },
        { name: '코울슬로', price: 1900, img: '/images/coleslaw.png' },
    ];


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
        if (popupItem.name === '코카콜라\nCola' || popupItem.name === '사이다\nSprite') {
            const newPrice = option === 'L' ? 2200 : 2000;
            setPopupPrice(newPrice);
        } else if (option === 'Set') {
            setPopupPrice(popupItem.price + 2000); // Increase by 2000 for Set options
        } else {
            setPopupPrice(popupItem.price); // Default price for other items
        }
    };

    const handleAddToOrder = () => {
        if (!selectedOption && (popupItem.name === '코카콜라\nCola' || popupItem.name === '사이다\nSprite' || popupItem.name === '아메리카노\nAmericano')) {
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

    /*const handlePay = () => {
        navigate('/order-details', { state: { selectedItems } });
    };*/


    const handlePay = () => {
        // Trigger the recommendation pop-up instead of navigating directly
        if (selectedItems.length > 0) {
            setIsRecommendationPopupVisible(true); // Show the recommendation pop-up
        } else {
            alert('Please select at least one menu item before proceeding.');
        }
    };
    


    

    const handleSelectRecommendedItem = (item) => {
        setRecommendedItems((prevItems) => {
          const isAlreadySelected = prevItems.some((selected) => selected.name === item.name);
          if (isAlreadySelected) {
            // Remove the item if it was already selected
            return prevItems.filter((selected) => selected.name !== item.name);
          } else {
            // Add the item if it wasn't selected
            return [...prevItems, item];
          }
        });
      };

      
    const handleConfirmOrder = () => {
        const updatedItems = [...selectedItems, ...recommendedItems];
        const totalAmount = updatedItems.reduce((total, item) => total + (item.price || 0), 0);
        navigate('/order-details', { state: { selectedItems: updatedItems, totalAmount } });
    };

    const handleSkipRecommendation = () => {
        setIsRecommendationPopupVisible(false);
        navigate('/order-details', { state: { selectedItems } });
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
        <div className="general-menu-screen">
        {/* Conditionally render the overlay */}
        {isBackgroundDimmed && <div className="generalmenu-overlay"></div>}
            <div className="generalmenu-top-bar">
                <h1 className="generalmenu-store-name">Fastfood Kiosk</h1>
                <div>
                    <button className="generalmenu-call-employee-button" onClick={handleCallEmployee}>직원호출</button>
                    <button className="generalmenu-home-button" onClick={handleHome}>홈</button>
                </div>
            </div>
            <div className="generalmenu-category-tabs">
                {Object.keys(categoryMapping).map((category) => (
                    <button
                        key={category}
                        className={`generalmenu-category-tab ${selectedCategory === categoryMapping[category] ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="generalmenu-menu-grid-container">
                <div className="generalmenu-menu-grid">
                    {currentItems.map((item, index) => (
                        <div key={index} className="generalmenu-menu-item" onClick={() => handleItemClick(item)}>
                            <div className="generalmenu-menu-image">
                                <img src={item.img} alt={item.name} />
                                {selectedCategory === 'new' && <span className="generalmenu-new-label">NEW</span>}
                                {item.best && <span className="generalmenu-best-label">BEST</span>}
                            </div>
                            <div className="generalmenu-menu-name">
                                {item.name}
                            </div>
                            <div className="generalmenu-menu-price">₩{item.price.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="generalmenu-pagination-controls">
                <button className="generalmenu-previous-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>이전</button>
                <button className="generalmenu-next-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={(currentPage + 1) * itemsPerPage >= menuData[selectedCategory].length}>다음</button>
            </div>

            <div className="generalmenu-order-history">
                <h2>주문 내역</h2>
            </div>

            <div className="generalmenu-order-summary">
                <div className="generalmenu-order-summary-header">
                    <span>제품명</span>
                    <span>수량</span>
                    <span>금액</span>
                </div>
                <div className="generalmenu-order-items">
                    {selectedItems.length > 0 ? (
                        selectedItems.map((item, index) => (
                            <div key={index} className="generalmenu-order-item">
                                <span>{item.name} {item.option && `(${item.option})`}</span>
                                <span>{item.quantity}</span>
                                <span>₩{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))
                    ) : (
                        <div className="generalmenu-order-item empty-space">원하시는 메뉴를 담아주세요.</div>
                    )}
                </div>
            </div>

            <div className="generalmenu-order-controls">
                <button className="generalmenu-cancel-all-button" onClick={handleCancelAll}>전체취소</button>
                <button className="generalmenu-pay-button" onClick={handlePay}>결제</button>
            </div>

            {popupItem && (
                <div className="generalmenu-menu-popup">
                    <div className="generalmenu-popup-content">
                        <div className="generalmenu-popup-header">
                            <h2>메뉴 선택</h2>
                            <button className="generalmenu-close-popup" onClick={handleCancelPopup}>×</button>
                        </div>
                        <div className="generalmenu-popup-body">
    <div className="generalmenu-popup-image">
        <img src={popupItem.img} alt={popupItem.name} />
    </div>
    <div className="generalmenu-popup-details">
    <h3 dangerouslySetInnerHTML={{ __html: popupItem.name.replace(/\n/g, '<br />') }}></h3>
    {/* Use dangerouslySetInnerHTML to interpret <br /> */}
    <p dangerouslySetInnerHTML={{ __html: popupItem.description}}></p>

    {popupItem.name === '코카콜라\nCola' || popupItem.name === '사이다\nSprite' ? (
        <div className="generalmenu-option-selection">
            <button onClick={() => handleOptionChange('M')} className={`generalmenu-option-button ${selectedOption === 'M' ? 'active' : ''}`}>M(₩2000)</button>
            <button onClick={() => handleOptionChange('L')} className={`generalmenu-option-button ${selectedOption === 'L' ? 'active' : ''}`}>L(₩2200)</button>
        </div>
    ) : popupItem.name === '아메리카노\nAmericano' ? (
        <div className="generalmenu-option-selection">
            <button onClick={() => handleOptionChange('HOT')} className={`generalmenu-option-button ${selectedOption === 'HOT' ? 'active' : ''}`}>HOT(₩2600)</button>
            <button onClick={() => handleOptionChange('ICE')} className={`generalmenu-option-button ${selectedOption === 'ICE' ? 'active' : ''}`}>ICE(₩2600)</button>
        
        </div>
    ) : null}

        <p className="generalmenu-popup-price">₩{popupPrice.toLocaleString()}</p>
        <div className="generalmenu-quantity-selection">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
    </div>
</div>

                        <div className="general-popup-footer">
                            <button className="general-cancel-button" onClick={handleCancelPopup}>취소</button>
                            <button className="general-add-button" onClick={handleAddToOrder}>담기</button>
                        </div>
                    </div>
                </div>
            )}


{isRecommendationPopupVisible && (
  <div className="recommendation-popup">
    <div className="recommendation-popup-content">
      {/* Popup Header */}
      <div className="recommendation-popup-header">
        <h2>추천 메뉴</h2>
        <button className="recommendation-close-popup" onClick={handleSkipRecommendation}>×</button>
      </div>

      {/* Phrase Section */}
      <div className="recommendation-subtext-container">
        <p className="recommendation-subtext">함께 즐기면 더욱 좋습니다!</p>
      </div>

      {/* Menu List */}
      <div className="recommendation-menu-list">
        {recommendedMenus.map((item) => (
          <div
            key={item.name}
            className={`recommendation-item ${
              recommendedItems.some(selected => selected.name === item.name) ? 'selected' : ''
            }`}
            onClick={() => handleSelectRecommendedItem(item)}
          >
            <div className="recommendation-menu-photo-container">
              <img src={item.img} alt={item.name} />
            </div>
            <p
              className="recommendation-menu-name"
              dangerouslySetInnerHTML={{ __html: item.name.replace(/\n/g, '<br />') }}
            ></p>
            <div className="recommendation-menu-price-container">
              <span>₩{item.price.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="recommendation-popup-footer">
        <button className="recommendation-unselect-button" onClick={handleSkipRecommendation}>
          선택안함
        </button>
        <button className="recommendation-confirm-button" onClick={handleConfirmOrder}>
          담기
        </button>
      </div>
    </div>
  </div>
)}



            
            {isEmployeePopupVisible && (
                <div className="general-employee-popup">
                    <div className="general-employee-popup-content">
                        <p className="general-employee-popup-message">직원을 호출했습니다! 잠시만 기다려주세요.</p>
                    </div>
                </div>
            )}
        </div>
    );


    
};

export default GeneralMenuScreen;