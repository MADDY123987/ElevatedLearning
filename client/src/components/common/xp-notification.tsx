import { Award } from 'lucide-react';

type XPNotificationProps = {
  amount: number;
};

const XPNotification = ({ amount }: XPNotificationProps) => {
  return (
    <div className="fixed top-20 right-4 bg-indigo-600 text-white p-3 rounded-lg shadow-lg z-50 flex items-center xp-notification">
      <Award className="h-6 w-6 mr-2 text-yellow-300" />
      <div>
        <p className="font-medium">+{amount} XP</p>
        <p className="text-xs text-indigo-200">Keep up the good work!</p>
      </div>
    </div>
  );
};

export default XPNotification;
