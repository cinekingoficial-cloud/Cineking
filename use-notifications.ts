import { useEffect } from "react";
import { differenceInDays } from "date-fns";
import type { Customer } from "@shared/schema";

export function useNotifications(user: Customer | null | undefined) {
  useEffect(() => {
    if (!user) return;

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Check expiration and show browser notification
    if (!('Notification' in window)) return;

    const checkExpiration = async () => {
      const daysLeft = differenceInDays(new Date(user.expirationDate), new Date());

      let message = '';
      if (daysLeft < 0 || user.status === 'Vencido') {
        message = 'Seu plano CINEKING+ venceu. Renove para continuar usando.';
      } else if (daysLeft === 1) {
        message = 'Seu plano vence amanhã. Renove agora!';
      } else if (daysLeft <= 5) {
        message = `Seu plano CINEKING+ vence em ${daysLeft} dias.`;
      }

      if (!message) return;

      // Throttle: only notify once per day per message
      const notifKey = `cineking_notif_${user.id}_${daysLeft}`;
      if (sessionStorage.getItem(notifKey)) return;
      sessionStorage.setItem(notifKey, '1');

      if (Notification.permission === 'granted') {
        new Notification('CINEKING+ - Aviso de Plano', {
          body: message,
          icon: '/icons/icon-192.png',
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('CINEKING+ - Aviso de Plano', {
            body: message,
            icon: '/icons/icon-192.png',
          });
        }
      }
    };

    checkExpiration();
  }, [user?.id]);
}
