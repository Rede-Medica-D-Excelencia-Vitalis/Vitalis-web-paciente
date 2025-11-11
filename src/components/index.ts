// Arquivo principal que exporta todos os componentes organizados por categoria
// Este arquivo permite imports limpos como: import { Layout, Button } from './components'

// Componentes de UI básicos
export * from './ui';

// Componentes de layout e navegação
export { Layout } from './layout/Layout';
export { ProtectedRoute } from './layout/ProtectedRoute';
export { PlanRequiredRoute } from './layout/PlanRequiredRoute';

// Componentes de autenticação
export { AuthInitializer } from './auth/AuthInitializer';

// Componentes relacionados a planos
export { PlanSelectionModal } from './plans/PlanSelectionModal';
export { PlanRequiredModal } from './plans/PlanRequiredModal';
export { PlanInfoModal } from './plans/PlanInfoModal';
export { PlanChangeModal } from './plans/PlanChangeModal';
export { PlanBanner } from './plans/PlanBanner';

// Componentes de notificação
export { NotificationDropdown, NotificationToaster } from './notifications';

// Componentes de tracking de pedidos
export { OrderTrackingSteps } from './tracking/OrderTrackingSteps';
export { OrderTrackingMap } from './tracking/OrderTrackingMap';
export { OrderReviewCard } from './tracking/OrderReviewCard';
export { OrderTrackingEstimate } from './tracking/OrderTrackingEstimate';

// Componentes específicos do negócio
export { FullscreenDebug } from './business/FullscreenDebug';

// Componentes de formulário (quando criados)
// export * from './forms';
