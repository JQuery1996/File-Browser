import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Fragment,
} from 'react';
import moment from 'moment';
import DModalContainer from '../dmodal-container/dmodal-container.component';
import { useAuth } from '../../contexts/AuthContext';

const DSessionTimeout = () => {
  const [events, setEvents] = useState(['click', 'load', 'keypress', 'scroll', 'mousedown']);
  const [isOpen, setOpen] = useState(false);
  const {
    auth,
    logout
  } = useAuth();

  let timeStamp;
  let warningInactiveInterval = useRef();
  let startTimerInterval = useRef();

  // start inactive check
  let timeChecker = () => {
    startTimerInterval.current = setTimeout(() => {
      let storedTimeStamp = sessionStorage.getItem('lastTimeStamp');
      warningInactive(storedTimeStamp);
    }, 900000);
  };

  // warning timer
  let warningInactive = (timeString) => {
    clearTimeout(startTimerInterval.current);

    warningInactiveInterval.current = setInterval(() => {
      const maxTime = 2;
      const popTime = 1;

      const diff = moment.duration(moment().diff(moment(timeString)));
      const minPast = diff.minutes();

      if (minPast === popTime) {
        setOpen(true);
      }

      if (minPast === maxTime) {
        clearInterval(warningInactiveInterval.current);
        sessionStorage.removeItem('lastTimeStamp');
        logout();
      }
    }, 1000);
  };

  // reset interval timer
  let resetTimer = useCallback(() => {
    clearTimeout(startTimerInterval.current);
    clearInterval(warningInactiveInterval.current);

    if (auth.isAuthenticated) {
      timeStamp = moment();
      sessionStorage.setItem('lastTimeStamp', timeStamp);
    } else {
      clearInterval(warningInactiveInterval.current);
      sessionStorage.removeItem('lastTimeStamp');
    }
    timeChecker();
    setOpen(false);
  }, [auth.isAuthenticated]);

  // handle close popup
  const handleClose = () => {
    setOpen(false);

    // resetTimer();
  };

  useEffect(() => {
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    timeChecker();
    resetTimer();
    return () => {
      clearTimeout(startTimerInterval.current);
      // resetTimer();
    };
  }, [resetTimer, events, timeChecker]);

  if (!isOpen) {
    return null;
  }



  // change fragment to modal and handleclose func to close
  // return <Fragment />;
  return (
    <DModalContainer handleClose={handleClose} title={'تنبيه'} >
      <p>سيتم تسجيل الخروج بعد دقيقة واحدة</p>
    </DModalContainer>
  )
};

export default DSessionTimeout;
