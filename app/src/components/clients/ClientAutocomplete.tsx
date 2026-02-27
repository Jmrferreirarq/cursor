import { useState, useRef, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { User, Plus } from 'lucide-react';
import type { Client } from '../../types';

interface ClientAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onClientSelect?: (client: Client | null) => void;
  placeholder?: string;
  className?: string;
}

export function ClientAutocomplete({
  value,
  onChange,
  onClientSelect,
  placeholder = 'Nome do cliente',
  className = '',
}: ClientAutocompleteProps) {
  const { clients } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar clientes pelo valor digitado
  const filteredClients = value.trim()
    ? clients.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase()) ||
        c.nif?.includes(value) ||
        c.email?.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8) // Limitar a 8 resultados
    : [];

  // Verificar se o valor atual corresponde a um cliente existente
  const exactMatch = clients.find(
    (c) => c.name.toLowerCase() === value.trim().toLowerCase()
  );

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight quando filteredClients muda
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredClients.length]);

  const handleSelect = (client: Client) => {
    onChange(client.name);
    onClientSelect?.(client);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredClients.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredClients.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredClients.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredClients[highlightedIndex]) {
          handleSelect(filteredClients[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    onClientSelect?.(null); // Reset selected client when typing
    setIsOpen(true);
  };

  const showDropdown = isOpen && value.trim() && (filteredClients.length > 0 || !exactMatch);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none ${className}`}
        autoComplete="off"
      />
      
      {/* Indicador de cliente existente */}
      {exactMatch && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="text-xs bg-green-500/20 text-green-600 px-2 py-0.5 rounded-full">
            Cliente existente
          </span>
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
        >
          {filteredClients.length > 0 ? (
            <ul className="max-h-64 overflow-auto">
              {filteredClients.map((client, index) => (
                <li key={client.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(client)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                      index === highlightedIndex
                        ? 'bg-primary/10'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {[client.municipality, client.email, client.nif]
                          .filter(Boolean)
                          .join(' · ') || 'Sem detalhes'}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          
          {/* Opção para criar novo cliente */}
          {!exactMatch && value.trim() && (
            <div className="border-t border-border">
              <button
                type="button"
                onClick={() => {
                  onClientSelect?.(null);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-muted transition-colors text-primary"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Criar novo cliente</p>
                  <p className="text-xs text-muted-foreground">"{value.trim()}"</p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
