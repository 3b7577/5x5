import { useEffect, type FC } from 'react';
import { TAG } from '@shared/tags';

import { getBorderHitCells } from '@/lib/overlayPresets';
import {
  adjacencyCoverage,
  boundingBox,
  centerEdgeCounts,
  centerOfMass,
  components,
  holes,
  longestRun,
  perimeter,
  quadrantPercents,
} from '@/lib/patternMath';
import { formatDensity } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal, {
  ModalBody,
  ModalClose,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  type ModalProps,
} from '@/components/ui/Modal';
import CopyControls from '@/components/patterns/pattern-info/CopyControls';
import {
  DebugTab,
  OverviewTab,
  VisualTab,
} from '@/components/patterns/pattern-info/tabs';
import usePatternInfoStore from '@/stores/usePatternInfoStore';
import type { Pattern, PatternInfoTab } from '@/types';

interface Props extends Omit<ModalProps, 'isOpen'> {
  pattern: Pattern;
}

const TABS: PatternInfoTab[] = ['overview', 'visual', 'debug'];

const PatternInfoModal: FC<Props> = ({ pattern, ...modalProps }) => {
  const { setPatternInfo, resetPatternInfo, activeTab, setActiveTab, bitId } =
    usePatternInfoStore();

  useEffect(() => {
    const { matrix, density, tags } = pattern;
    const size = matrix.length;

    const comps = components(matrix);
    const componentsCount =
      typeof comps === 'number'
        ? comps
        : ((comps as unknown as { count?: number } | null)?.count ?? 0);
    const perim = perimeter(matrix);
    const { total: borderHitCellsCount } = getBorderHitCells(matrix);
    const centerVsEdge = centerEdgeCounts(matrix, tags);
    const holeCount = holes(matrix);
    const runs = longestRun(matrix);
    const adjacency = adjacencyCoverage(matrix);
    const quadrants = quadrantPercents(matrix);
    const bbox = boundingBox(matrix);
    const centroid = centerOfMass(matrix);

    const axes = [TAG.SYM_H, TAG.SYM_V, TAG.SYM_DIAG, TAG.SYM_ANTI_DIAG].map(
      ({ key }) => key,
    );
    const symmetryCount = axes.filter((k) => tags.includes(k)).length;

    const fillPct = Math.round((density / (size * size)) * 100);
    const { center, edge } = centerVsEdge;
    const centerPct = Math.round(
      center + edge === 0 ? 0 : (center / Math.max(center + edge, 1)) * 100,
    );

    setPatternInfo(pattern, {
      componentsCount,
      perimeter: perim,
      borderHitCellsCount,
      centerVsEdge,
      holeCount,
      runs,
      adjacency,
      quadrants,
      bbox,
      centroid,
      symmetryCount,
      fillPct,
      centerPct,
    });

    return () => {
      resetPatternInfo();
    };
  }, [pattern.id]);

  return (
    <Modal {...modalProps} isOpen>
      <ModalHeader>
        <ModalTitle>
          <div className='flex items-center gap-3'>
            <span>Pattern #{bitId}</span>
            <span className='text-muted-foreground text-xs'>
              {formatDensity(pattern.density)}
            </span>
          </div>
        </ModalTitle>
        <ModalClose />
      </ModalHeader>

      <ModalBody>
        {activeTab === 'overview' && <OverviewTab />}

        {activeTab === 'visual' && <VisualTab />}

        {activeTab === 'debug' && <DebugTab />}
      </ModalBody>

      <ModalFooter>
        <div className='flex items-center justify-between gap-2'>
          <CopyControls />

          <div className='flex gap-2'>
            {TABS.map((t) => (
              <Button
                key={t}
                variant={activeTab === t ? 'default' : 'secondary'}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default PatternInfoModal;
