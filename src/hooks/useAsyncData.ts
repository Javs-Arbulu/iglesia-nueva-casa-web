import { useCallback, useEffect, useState } from 'react'

export type AsyncStatus = 'loading' | 'success' | 'error'

export interface AsyncData<T> {
  data: T
  status: AsyncStatus
  /** Vuelve a ejecutar el fetch sin volver al estado de carga inicial. */
  refresh: () => Promise<void>
  /** Actualiza los datos localmente (útil para updates optimistas). */
  setData: React.Dispatch<React.SetStateAction<T>>
}

/**
 * Encapsula el patrón repetido en el admin: cargar datos async con estado
 * loading/success/error, cancelación al desmontar y un refresh manual.
 *
 * El `fetcher` debe estar memoizado (useCallback) por el consumidor, ya que es
 * la dependencia que dispara la recarga.
 *
 * @param fetcher  función que devuelve los datos
 * @param initial  valor inicial mientras carga
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  initial: T
): AsyncData<T> {
  const [data, setData] = useState<T>(initial)
  const [status, setStatus] = useState<AsyncStatus>('loading')

  useEffect(() => {
    let active = true
    fetcher()
      .then((d) => {
        if (!active) return
        setData(d)
        setStatus('success')
      })
      .catch((err) => {
        if (!active) return
        console.error(err)
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [fetcher])

  const refresh = useCallback(async () => {
    try {
      setData(await fetcher())
    } catch (err) {
      console.error(err)
    }
  }, [fetcher])

  return { data, status, refresh, setData }
}
