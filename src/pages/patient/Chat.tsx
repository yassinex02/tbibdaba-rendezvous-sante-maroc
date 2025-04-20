
import DashboardLayout from '../../components/layout/DashboardLayout';
import ChatRoom from '../../components/chat/ChatRoom';

const PatientChat = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mes conversations</h1>
          <p className="text-muted-foreground">
            Communiquez avec vos médecins en toute sécurité
          </p>
        </div>

        <ChatRoom />
      </div>
    </DashboardLayout>
  );
};

export default PatientChat;
