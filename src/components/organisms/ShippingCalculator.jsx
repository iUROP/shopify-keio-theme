import React, { useState, useEffect } from 'react'
import Icon from '../atoms/Icon'

function ShippingCalculator({
  blocks
}) {
  const [currentDay, setCurrentDay] = useState(false);
  const [shippingStart, setShippingStart] = useState(false);
  const [nextDay, setNextDay] = useState(false);
  const [deliveryDay, setDeliveryDay] = useState(false);
  const [limitDay, setLimitDay] = useState(false);
  const [limitPreDay, setLimitPreDay] = useState(false);
  const [beforeNextDay, setBeforeNextDay] = useState('');
  const endDayHour = 14;

  useEffect(() => {
    const date = new Date();
    const options = { month: 'long' };
    const month = new Intl.DateTimeFormat('es-ES', options).format(date).toUpperCase();
    const monthSimply = new Intl.DateTimeFormat('es-ES', options).format(date);
    let moreTime = 0

    if (date.getHours() >= 14) {
      moreTime = 1
    }

    let day = date.getDate();
    const formatedToday = `${month} ${day}`;
    setCurrentDay(formatedToday);

    let tomorrowDay = date.getDate() + moreTime;
    const formatedShip = `${month} ${tomorrowDay}`;
    setShippingStart(formatedShip);

    let shippingDate = date.getDate() + (moreTime + 1);
    const formatedShipping = `${month} ${shippingDate}`;
    setNextDay(formatedShipping);

    let deliveryDate = date.getDate() + (moreTime + 1 + 1);
    const formatedDelivery = `${month} ${deliveryDate}`;
    setDeliveryDay(formatedDelivery);

    const formatedPreLimit = `${deliveryDate} de ${monthSimply}`;
    setLimitPreDay(formatedPreLimit);

    let limitDate = date.getDate() + (moreTime + 1 + 1 + 1);
    const formatedLimitDate = `${limitDate} de ${monthSimply}`;
    setLimitDay(formatedLimitDate);
  
    
    const counter = () => {
      const dateReact = new Date()
      let targetTime = new Date(dateReact);
      targetTime.setHours(endDayHour, 0, 0, 0);

      if (dateReact >= targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const diff = targetTime - dateReact;

      let totalSegs = Math.floor(diff / 1000);
      let hours = String(Math.floor(totalSegs / 3600)).padStart(2, '0');
      let mins = String(Math.floor((totalSegs % 3600) / 60)).padStart(2, '0');
      let segs = String(totalSegs % 60).padStart(2, '0');

      setBeforeNextDay(
        `${hours} horas ${mins} minutos ${segs} segundos`
      );
    }

    counter();
    setInterval(counter, 1000);

  }, [])

  return (
    <div className={`i-shipping-calculator`}>
      <div className='i-shipping-calculator__char'>
        <div className='i-shipping-calculator__char--item'>
          <Icon name="ship-bag" />
          <h3>Pedido</h3>
          <p>{currentDay}</p>
        </div>
        <div className='i-shipping-calculator__char--separator'><Icon name="ship-arrow" /></div>
        <div className='i-shipping-calculator__char--item'>
          <Icon name="ship-car" />
          <h3>Envío</h3>
          <p>{shippingStart} - {nextDay}</p>
        </div>
        <div className='i-shipping-calculator__char--separator'><Icon name="ship-arrow" /></div>
        <div className='i-shipping-calculator__char--item'>
          <Icon name="ship-location" />
          <h3>Entregado</h3>
          <p>{deliveryDay}</p>
        </div>
      </div>
      <div className='i-shipping-calculator__labels'>
        <div>Haz tu pedido en las próximas <span>{beforeNextDay}</span></div>
        <div>y  recibe tu paquete entre el <span>{limitPreDay} y el {limitDay}.</span></div>
      </div>
    </div>
  )
}

export default ShippingCalculator