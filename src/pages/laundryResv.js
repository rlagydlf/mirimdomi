import React, { useState } from 'react';
import './css/laundryResv.css';

function LaundryResv({ userInfo }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}.${month}.${day}`;

  const washMacs = [
    { id: 1, status: '비어있음' },
    { id: 2, status: '사용중' },
    { id: 3, status: '비어있음' },
  ];

  const initialReservationSlots = [
    { id: 'A1', time: '09:00', status: 'available', room: null, name: null },
    { id: 'A2', time: '10:00', status: 'reserved', room: '402호', name: null },
    { id: 'A3', time: '11:00', status: 'available', room: null, name: null },
    { id: 'A4', time: '12:00', status: 'available', room: null, name: null },
    { id: 'B1', time: '13:00', status: 'reserved', room: '402호', name: null },
    { id: 'B2', time: '14:00', status: 'available', room: null, name: null },
    { id: 'B3', time: '15:00', status: 'reserved', room: '402호', name: null },
    { id: 'B4', time: '16:00', status: 'available', room: null, name: null },
    { id: 'C1', time: '17:00', status: 'available', room: null, name: null },
    { id: 'C2', time: '18:00', status: 'available', room: null, name: null },
    { id: 'C3', time: '19:00', status: 'reserved', room: '402호', name: null },
    { id: 'C4', time: '20:00', status: 'available', room: null, name: null },
  ];

  const [reservationSlots, setReservationSlots] = useState(initialReservationSlots);

  const washMacImagePath = process.env.PUBLIC_URL + '/img/washMacImg.svg';
  const emptyWashMacImagePath = process.env.PUBLIC_URL + '/img/emptyWashMacImg.svg';

  const handleReservationClick = (slotId) => {
    // 사용자 정보가 없으면 예약 불가
    if (!userInfo) {
      alert('로그인이 필요합니다.');
      return;
    }

    setReservationSlots(currentSlots =>
      currentSlots.map(slot => {
        if (slot.id === slotId) {
          // 사용자 정보로 예약 슬롯 업데이트
          const roomNumber = userInfo.roomNumber ? `${userInfo.roomNumber}호` : '호실 정보 없음';
          const userName = userInfo.name || '이름 없음';
          return { ...slot, status: 'selected', room: roomNumber, name: userName };
        }
        return slot;
      })
    );
  };

  return (
    <div className='container2'>
      <div className="contentText">
        <h5 className="laundryResv-title">세탁 예약</h5>                    
        <p className="current-date">{formattedDate}</p>

        <div className="wash-mac-list">
          {washMacs.map((machine) => (
            <div key={machine.id} className="wash-mac-item">
              <div className="wash-mac-image-wrapper">
                <span className="wash-mac-number">{machine.id}번</span>
                <img
                  src={machine.status === '비어있음' ? emptyWashMacImagePath : washMacImagePath}
                  alt="Washing Machine"
                  className="wash-mac-image"
                />
              </div>
              <div className={`wash-mac-status ${machine.status === '사용중' ? 'in-use' : 'empty'}`}>
                {machine.status}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='reservationBox'>
        <img className="resvTime" src={process.env.PUBLIC_URL + '/img/resvTime.svg'} alt="Reservation Box" />
        <div className='resvBox'>
          <div className='reservation-grid'>
            {reservationSlots.map((slot) => {
              if (slot.status === 'reserved') {
                return (
                  <div key={slot.id} className="reserved-slot-content">
                    {slot.room}
                  </div>
                );
              } else if (slot.status === 'selected') {
                return (
                  <div key={slot.id} className="reservation-slot selected">
                    <span className="slot-room">{slot.room}</span>
                    <span className="slot-name">{slot.name}</span>
                  </div>
                );
              } else { // available
                return (
                  <div
                    key={slot.id}
                    className="reservation-slot available"
                    onClick={() => handleReservationClick(slot.id)}
                  >
                    {/* No content for available slots as per user request */}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaundryResv;
