from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseJobSourceAdapter(ABC):
    @property
    @abstractmethod
    def source_name(self) -> str:
        pass

    @abstractmethod
    def fetch_jobs(self, query: str = "", limit: int = 10) -> List[Dict[str, Any]]:
        """
        Fetches postings from the job source using permitted APIs, public feeds, or compliant discovery methods.
        """
        pass
