/**
 * Route /chat — Page dédiée à l'affichage dans l'iframe du widget.
 *
 * Cette page ne contient QUE le ChatWindow, sans header ni footer.
 * Elle est chargée dans l'iframe injectée par widget.js sur le site client.
 *
 * Accès direct : https://ton-chatbot.vercel.app/chat
 */
import type { Metadata } from 'next';
import ChatWindow from '@/components/ChatWindow';

export const metadata: Metadata = {
  robots: 'noindex, nofollow', // Ne pas indexer cette page (usage interne iframe)
};

export default function ChatPage() {
  return (
    /*
     * fixed inset-0 → remplit exactement la taille de l'iframe
     * bg-white      → fond propre, pas affecté par le bg-gray-50 du layout racine
     */
    <div className="fixed inset-0 bg-white overflow-hidden">
      <ChatWindow />
    </div>
  );
}
