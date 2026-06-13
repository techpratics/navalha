import { useState, useEffect } from 'react';
import { catalogService } from '../services/catalog.service';
import { professionalService } from '../services/professional.service';
import type { Professional } from '../types/professional';

export function useProfessionalServices(professional: Professional | null, isOpen: boolean) {
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [linkedServiceIds, setLinkedServiceIds] = useState<Set<string>>(new Set());
  const [vinculoIdMap, setVinculoIdMap] = useState<Map<string, string>>(new Map());
  // vinculoIdMap = { servicoId → id do vínculo }
  // ex: { "0f5ad25f-..." → "031e2cbc-..." }

  useEffect(() => {
    if (!isOpen || !professional) return;
    const professionalId = professional.id;

    async function loadData() {
      setLoading(true);
      try {
        const [allServices, profServices] = await Promise.all([
          catalogService.getServices(),
          professionalService.getProfessionalServices(professionalId)
        ]);

        setCatalog(allServices);

        // Guarda quais servicoIds estão vinculados
        const linkedIds = new Set<string>(
          (profServices || []).map((s: any) => s.servicoId).filter(Boolean)
        );
        setLinkedServiceIds(linkedIds);

        // Guarda o mapa servicoId → id do vínculo
        const map = new Map<string, string>(
          (profServices || []).map((s: any) => [s.servicoId, s.id])
        );
        setVinculoIdMap(map);

      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isOpen, professional]);

  const toggleService = async (servicoId: string, isCurrentlyLinked: boolean) => {
    if (!professional) return;

    // Atualização visual instantânea
    setLinkedServiceIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyLinked) next.delete(servicoId);
      else next.add(servicoId);
      return next;
    });

    try {
      if (isCurrentlyLinked) {
        // Pega o id do VÍNCULO no map
        const vinculoId = vinculoIdMap.get(servicoId);
        if (!vinculoId) throw new Error("Vínculo não encontrado");

        await professionalService.unlinkService(professional.id, vinculoId); // ✅ ID correto

        // Remove do map
        setVinculoIdMap(prev => {
          const next = new Map(prev);
          next.delete(servicoId);
          return next;
        });

      } else {
        // Vincula e guarda o id do novo vínculo no map
        const response = await professionalService.linkService(professional.id, servicoId);
        
        setVinculoIdMap(prev => new Map(prev).set(servicoId, response.id));
      }
    } catch (error: any) {
      console.error("Erro:", error.response?.data);

      // Reverte visual
      setLinkedServiceIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyLinked) next.add(servicoId);
        else next.delete(servicoId);
        return next;
      });
    }
  };

  return { catalog, linkedServiceIds, loading, toggleService };
}