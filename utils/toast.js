import Swal from 'sweetalert2';

export const createToast = async (message, type = 'error', position = 'top-right') => {
    const Toast = Swal.mixin({
        toast: true,
        position: position,
        iconColor: type,
        customClass: {
            popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    await Toast.fire({
        icon: type,
        title: message
    })
}