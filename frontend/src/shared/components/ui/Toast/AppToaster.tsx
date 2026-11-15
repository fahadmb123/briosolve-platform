import { Toaster, ToastBar } from 'react-hot-toast';
import { toastContainerStyle, toastOptions, configureToastInterceptors } from './toastConfig';

configureToastInterceptors();

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      containerStyle={toastContainerStyle}
      toastOptions={toastOptions}
    >
      {(t) => (
        <ToastBar toast={t} position={t.position || 'bottom-center'} style={{ ...t.style }}>
          {({ message }) => message}
        </ToastBar>
      )}
    </Toaster>
  );
}
