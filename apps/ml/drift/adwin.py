import logging

logger = logging.getLogger(__name__)

_ADWIN_AVAILABLE = False

try:
    from river.drift import ADWIN as _ADWIN
    _ADWIN_AVAILABLE = True
except Exception as _e:
    logger.warning(f"river ADWIN not available: {_e}")


class ADWINDetector:
    """Adaptive Windowing (ADWIN) drift detector from river.
    Falls back to a no-op if river is not installed.
    """

    def __init__(self, delta: float = 0.002):
        self.delta = delta
        self._detector = _ADWIN(delta=delta) if _ADWIN_AVAILABLE else None
        self.drift_detected = False
        self._n_updates = 0

    def update(self, value: float) -> bool:
        """Feed one observation. Returns True if drift detected."""
        if self._detector is None:
            return False
        try:
            self._detector.update(value)
            self.drift_detected = bool(self._detector.drift_detected)
            self._n_updates += 1
            return self.drift_detected
        except Exception as e:
            logger.warning(f"ADWIN update failed: {e}")
            return False

    def reset(self) -> None:
        if _ADWIN_AVAILABLE:
            self._detector = _ADWIN(delta=self.delta)
        self.drift_detected = False
        self._n_updates = 0

    @property
    def available(self) -> bool:
        return _ADWIN_AVAILABLE
