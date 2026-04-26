import logging
import numpy as np

logger = logging.getLogger(__name__)

_GNN_AVAILABLE = False
GNNModel = None

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    from torch_geometric.nn import GCNConv
    from torch_geometric.data import Data

    _GNN_AVAILABLE = True

    class _GNNClassifier(nn.Module):
        def __init__(self, in_channels: int, hidden: int = 64, out_channels: int = 2):
            super().__init__()
            self.conv1 = GCNConv(in_channels, hidden)
            self.conv2 = GCNConv(hidden, hidden)
            self.lin = nn.Linear(hidden, out_channels)

        def forward(self, x, edge_index):
            x = F.relu(self.conv1(x, edge_index))
            x = F.dropout(x, p=0.3, training=self.training)
            x = F.relu(self.conv2(x, edge_index))
            return self.lin(x)

    class GNNModel:
        """CPU-only GNN for relational credit risk modelling."""

        def __init__(self, hidden: int = 64, epochs: int = 50, lr: float = 1e-3):
            self.hidden = hidden
            self.epochs = epochs
            self.lr = lr
            self._net: _GNNClassifier | None = None

        def _tabular_to_graph(self, X: np.ndarray) -> "Data":
            n = X.shape[0]
            x = torch.tensor(X, dtype=torch.float)
            # Naive k-NN-style edges: connect each node to its 5 nearest neighbours
            from sklearn.neighbors import NearestNeighbors
            nbrs = NearestNeighbors(n_neighbors=min(6, n), algorithm="auto").fit(X)
            _, indices = nbrs.kneighbors(X)
            rows, cols = [], []
            for i, nbr in enumerate(indices):
                for j in nbr[1:]:
                    rows.append(i)
                    cols.append(j)
            edge_index = torch.tensor([rows, cols], dtype=torch.long)
            return Data(x=x, edge_index=edge_index)

        def fit(self, X: np.ndarray, y: np.ndarray) -> "GNNModel":
            data = self._tabular_to_graph(X)
            self._net = _GNNClassifier(in_channels=X.shape[1], hidden=self.hidden)
            optimizer = torch.optim.Adam(self._net.parameters(), lr=self.lr)
            labels = torch.tensor(y, dtype=torch.long)
            self._net.train()
            for _ in range(self.epochs):
                optimizer.zero_grad()
                out = self._net(data.x, data.edge_index)
                loss = F.cross_entropy(out, labels)
                loss.backward()
                optimizer.step()
            return self

        def predict_proba(self, X: np.ndarray) -> np.ndarray:
            assert self._net is not None
            data = self._tabular_to_graph(X)
            self._net.eval()
            with torch.no_grad():
                logits = self._net(data.x, data.edge_index)
                probs = F.softmax(logits, dim=1).numpy()
            return probs

        def predict(self, X: np.ndarray) -> np.ndarray:
            return (self.predict_proba(X)[:, 1] >= 0.5).astype(int)

        def get_feature_importances(self) -> np.ndarray | None:
            return None

except Exception as _e:
    logger.warning(f"GNN model not available (torch-geometric missing?): {_e}")
    GNNModel = None
